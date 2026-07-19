import { Content, GenerativeContentBlob, Part } from "@google/generative-ai";
import { EventEmitter } from "eventemitter3";
import { difference } from "lodash";
import {
	type ClientContentMessage,
	isInterrupted,
	isModelTurn,
	isServerContenteMessage,
	isSetupCompleteMessage,
	isToolCallCancellationMessage,
	isToolCallMessage,
	isTurnComplete,
	type LiveConfig,
	type LiveIncomingMessage,
	type ModelTurn,
	type RealtimeInputMessage,
	type ServerContent,
	type SetupMessage,
	type StreamingLog,
	type ToolCall,
	type ToolCallCancellation,
	type ToolResponseMessage,
} from "../multimodal-live";
import { base64ToArrayBuffer, blobToJSON } from "./utils";

/**
 * the events that this client will emit
 */
interface MultimodalLiveClientEventTypes {
	open: () => void;
	log: (log: StreamingLog) => void;
	close: (event: CloseEvent) => void;
	error: (error: Error) => void; // Add error event type
	audio: (data: ArrayBuffer) => void;
	content: (data: ServerContent) => void;
	interrupted: () => void;
	setupcomplete: () => void;
	turncomplete: () => void;
	toolcall: (toolCall: ToolCall) => void;
	toolcallcancellation: (toolcallCancellation: ToolCallCancellation) => void;
}

export type MultimodalLiveAPIClientConnection = {
	url?: string;
	apiKey: string;
};

/**
 * A event-emitting class that manages the connection to the websocket and emits
 * events to the rest of the application.
 * If you dont want to use react you can still use this.
 */
export class MultimodalLiveClient extends EventEmitter<MultimodalLiveClientEventTypes> {
	public ws: WebSocket | null = null;
	protected config: LiveConfig | null = null;
	public url: string = "";
	public getConfig() {
		return { ...this.config };
	}

	constructor({ url, apiKey }: MultimodalLiveAPIClientConnection) {
		super();
		url =
			url ||
			`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
		url += `?key=${apiKey}`;
		this.url = url;
		this.send = this.send.bind(this);
	}

	log(type: string, message: StreamingLog["message"]) {
		const log: StreamingLog = {
			date: new Date(),
			type,
			message,
		};
		this.emit("log", log);
	}

	connect(config: LiveConfig): Promise<boolean> {
		console.log("[MultimodalLiveClient] connect() called with config:", config.model);
		this.config = config;

		console.log("[MultimodalLiveClient] Creating WebSocket to:", this.url.substring(0, 50) + "...");
		const ws = new WebSocket(this.url);
		this.ws = ws;

		ws.addEventListener("message", async (evt: MessageEvent) => {
			if (this.ws !== ws) return;
			if (evt.data instanceof Blob || typeof evt.data === "string") {
				this.receive(evt.data);
			} else {
				console.log("[MultimodalLiveClient] Received non-json message:", evt.data);
			}
		});
		return new Promise((resolve, reject) => {
			let opened = false;
			const onError = (ev: Event) => {
				console.error("[MultimodalLiveClient] WebSocket error:", ev);
				this.disconnect(ws);
				const message = `Could not connect to "${this.url.substring(0, 50)}..."`;
				this.log(`server.${ev.type}`, message);
				this.emit("error", new Error(message));
				reject(new Error(message));
			};
			const onCloseBeforeOpen = (ev: CloseEvent) => {
				if (opened) return;
				const message = ev.reason || `WebSocket closed before connection completed (code: ${ev.code})`;
				this.disconnect(ws);
				this.log("server.close", message);
				reject(new Error(message));
			};
			ws.addEventListener("error", onError);
			ws.addEventListener("close", onCloseBeforeOpen);
			ws.addEventListener("open", (ev: Event) => {
				if (this.ws !== ws) {
					ws.close();
					return;
				}
				opened = true;
				ws.removeEventListener("close", onCloseBeforeOpen);
				console.log("[MultimodalLiveClient] WebSocket opened!");
				if (!this.config) {
					console.error("[MultimodalLiveClient] No config available!");
					reject("Invalid config sent to `connect(config)`");
					return;
				}
				this.log(`client.${ev.type}`, `connected to socket`);
				this.emit("open");

				const setupMessage: SetupMessage = {
					setup: this.config,
				};
				console.log("[MultimodalLiveClient] Sending setup message...");
				this._sendDirect(setupMessage);
				this.log("client.send", "setup");

				ws.removeEventListener("error", onError);
				ws.addEventListener("close", (ev: CloseEvent) => {
					const wasCurrentSocket = this.disconnect(ws);
					if (!wasCurrentSocket && this.ws) return;
					console.log("[MultimodalLiveClient] WebSocket closed:", ev.code, ev.reason);
					let reason = ev.reason || "";
					if (reason.toLowerCase().includes("error")) {
						const prelude = "ERROR]";
						const preludeIndex = reason.indexOf(prelude);
						if (preludeIndex > 0) {
							reason = reason.slice(
								preludeIndex + prelude.length + 1,
								Infinity,
							);
						}
					}
					this.log(
						`server.${ev.type}`,
						`disconnected ${reason ? `with reason: ${reason}` : ``}`,
					);
					this.emit("close", ev);
				});
				console.log("[MultimodalLiveClient] Connection successful, resolving promise");
				resolve(true);
			});
		});
	}

	disconnect(ws?: WebSocket) {
		// could be that this is an old websocket and theres already a new instance
		// only close it if its still the correct reference
		if ((!ws || this.ws === ws) && this.ws) {
			if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
				this.ws.close();
			}
			this.ws = null;
			this.log("client.close", `Disconnected`);
			return true;
		}
		return false;
	}

	protected async receive(data: Blob | string) {
		let response: LiveIncomingMessage;
		try {
			response = (
				data instanceof Blob
					? await blobToJSON(data)
					: JSON.parse(data)
			) as LiveIncomingMessage;
		} catch (error) {
			console.warn("[MultimodalLiveClient] Failed to parse message:", error);
			return;
		}
		if (isToolCallMessage(response)) {
			this.log("server.toolCall", response);
			this.emit("toolcall", response.toolCall);
			return;
		}
		if (isToolCallCancellationMessage(response)) {
			this.log("receive.toolCallCancellation", response);
			this.emit("toolcallcancellation", response.toolCallCancellation);
			return;
		}

		if (isSetupCompleteMessage(response)) {
			this.log("server.send", "setupComplete");
			this.emit("setupcomplete");
			return;
		}

		// this json also might be `contentUpdate { interrupted: true }`
		// or contentUpdate { end_of_turn: true }
		if (isServerContenteMessage(response)) {
			const { serverContent } = response;
			if (isInterrupted(serverContent)) {
				this.log("receive.serverContent", "interrupted");
				this.emit("interrupted");
				return;
			}

			if (isModelTurn(serverContent)) {
				let parts: Part[] = serverContent.modelTurn.parts;

				// when its audio that is returned for modelTurn
				const audioParts = parts.filter((p) =>
					p.inlineData?.mimeType.startsWith("audio/pcm"),
				);
				const base64s = audioParts.map((p) => p.inlineData?.data);

				// strip the audio parts out of the modelTurn
				const otherParts = difference(parts, audioParts);

				base64s.forEach((b64) => {
					if (b64) {
						const data = base64ToArrayBuffer(b64);
						this.emit("audio", data);
						// Server Response in Base64
						this.log(`server.audio`, `buffer (${data.byteLength})`);
					}
				});
				if (!otherParts.length) {
					return;
				}

				parts = otherParts;

				const content: ModelTurn = { modelTurn: { parts } };
				this.emit("content", content);
				this.log(`server.content`, response);
			}

			if (isTurnComplete(serverContent)) {
				this.log("server.send", "turnComplete");
				this.emit("turncomplete");
			}
		}
	}

	sendRealtimeInput(chunks: GenerativeContentBlob[]) {
		let hasAudio = false;
		let hasVideo = false;

		for (let i = 0; i < chunks.length; i++) {
			const ch = chunks[i];
			if (ch.mimeType.includes("audio")) {
				hasAudio = true;
				this._sendDirect({
					realtimeInput: {
						audio: {
							mimeType: ch.mimeType,
							data: ch.data,
						},
					},
				});
			} else if (ch.mimeType.includes("image") || ch.mimeType.includes("video")) {
				hasVideo = true;
				this._sendDirect({
					realtimeInput: {
						video: {
							mimeType: ch.mimeType,
							data: ch.data,
						},
					},
				});
			}
		}

		const message =
			hasAudio && hasVideo
				? "audio + video"
				: hasAudio
					? "audio"
					: hasVideo
						? "video"
						: "unknown";

		this.log(`client.realtimeInput`, message);
	}

	sendAudioStreamEnd() {
		this._sendDirect({
			realtimeInput: {
				audioStreamEnd: true,
			},
		});
		this.log("client.realtimeInput", "audioStreamEnd");
	}

	sendActivityStart() {
		this._sendDirect({
			realtimeInput: {
				activityStart: {},
			},
		});
		this.log("client.realtimeInput", "activityStart");
	}

	sendActivityEnd() {
		this._sendDirect({
			realtimeInput: {
				activityEnd: {},
			},
		});
		this.log("client.realtimeInput", "activityEnd");
	}

	sendRealtimeText(text: string) {
		this._sendDirect({
			realtimeInput: {
				text,
			},
		});
		this.log("client.realtimeInput", "text");
	}

	/**
	 *  send a response to a function call and provide the id of the functions you are responding to
	 */
	sendToolResponse(toolResponse: ToolResponseMessage["toolResponse"]) {
		const message: ToolResponseMessage = {
			toolResponse,
		};

		this._sendDirect(message);
		this.log(`client.toolResponse`, message);
	}

	/**
	 * send normal content parts such as { text }
	 */
	send(parts: Part | Part[], turnComplete: boolean = true) {
		parts = Array.isArray(parts) ? parts : [parts];
		const content: Content = {
			role: "user",
			parts,
		};

		const clientContentRequest: ClientContentMessage = {
			clientContent: {
				turns: [content],
				turnComplete,
			},
		};

		this._sendDirect(clientContentRequest);
		this.log(`client.send`, clientContentRequest);
	}

	/**
	 *  used internally to send all messages
	 *  don't use directly unless trying to send an unsupported message type
	 */
	_sendDirect(request: object) {
		if (!this.ws) {
			throw new Error("WebSocket is not connected");
		}
		const str = JSON.stringify(request);
		this.ws.send(str);
	}
}
