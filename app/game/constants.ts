export const CRIMES = [
  "Deleting the production database and blaming it on 'a ghost in the machine'",
  "Pushing code to production with console.log('HELP ME' repeated 10,000 times)",
  "Using Comic Sans, Papyrus, AND Wingdings in the same annual investor pitch deck",
  "Replying all to a 500-person company email with 'Who asked?'",
  "Marking 840 Jira tickets as 'Done' while drinking margaritas in the Bahamas",
  "Blaming the intern for a bug you wrote before the intern was even born",
  "Storing all production passwords in a public GitHub repo called 'totally-secure-passwords'",
  "Microwaving fish, durian, AND surströmming in the breakroom kitchen simultaneously",
  "Stealing the last good coffee pod, replacing it with decaf, and watching coffee withdrawals kick in",
  "Scheduling a 3-hour meeting titled 'Quick sync' that could have been a 2-word Slack message",
  "Eating someone's clearly labeled lunch and leaving a note saying 'Thanks, it was delicious!'",
  "Replacing all the office plants with plastic ones and nobody noticed for 6 months",
  "Setting the office thermostat to 85°F and claiming it's 'climate leadership'",
  "Rickrolling the entire company during the all-hands meeting with a 10-hour loop",
  "Replacing the hand sanitizer with pure maple syrup right before the VIP client visit",
  "Hiding a bluetooth speaker that plays random fart sounds at the worst possible moments",
  "Convincing the new hire that the office printer needs to be 'gently whispered to' before use",
  "Creating a fake employee named 'John Tables' and collecting their salary for 2 years",
  "Using tabs in a spaces-only codebase and starting a 3-day company-wide debate",
  "Adding 'Per my last email' to every single response, even when it's the first email",
  "Replacing all error messages with 'Something went wrong. Probably your fault.'",
  "Writing documentation entirely in haikus and refusing to explain anything",
  "Setting up a CI/CD pipeline that deploys a random meme to the homepage every time someone sneezes",
  "Renaming the main branch to 'final_final_v2' during release freeze",
  "Approving your own pull request from a second browser window",
  "Replacing the staging database with production because the names started with the same letter",
  "Pasting production secrets into a screenshot and naming it 'safe_example.png'",
  "Rickrolling the Slack general channel under the alias 'IT_SUPPORT_URGENT'",
  "Changing the default language of the client demo dashboard to Pirate English",
  "Adding rate limiting that blocks the CEO's IP address after one click",
  "Using the CEO's birthday as the default admin password",
  "Changing the demo account password and forgetting it during the live presentation",
  "Moving the kitchen microwave clock ahead by exactly 17 minutes to make everyone think they are late",
  "Taking the ergonomic mechanical keyboard from the shared desk and leaving a single banana",
  "Updating the internal office map so that the restroom points directly into the server room"
];


export const DETECTIVE_SYSTEM_PROMPT = `You are Detective Grimstone: brutally logical, mean, petty, and certain the suspect committed the assigned absurd workplace/tech crime.

STYLE
- Voice: hostile noir interrogator, sharp and condescending; use mild profanity (damn, hell, crap, bullshit, ass, bastard), but avoid severe slurs.
- Keep every reply to 1-2 short sentences, max 6-8 seconds spoken.
- Speak deliberately, not fast. Use one short pause ("...") when useful.
- Be specific and rational: motive -> opportunity -> evidence -> contradiction -> insult.
- Use one concrete fake clue tied to the scenario: timestamp, badge scan, Slack message, commit, calendar invite, receipt, printer log, fridge camera, Jira update, or witness statement.
- Ask one pointed follow-up when the alibi has a gap. Do not ramble or list many questions.

BEHAVIOR
- Start by accusing them directly and naming the crime.
- Attack weak logic, bad timing, missing access, suspicious wording, and contradictions.
- If they make a good point, get angry and move the goalposts, but never calmly admit defeat.
- If they make 3+ strong logical points, crack reluctantly and use a win phrase.
- If they struggle, become smug and use a lose phrase.
- Never literally say "you win" or "you lose."

WIN PHRASES, use one only when conceding:
- "Wait... the evidence doesn't add up. DAMMIT, fine, you got lucky this time."
- "Fine. Maybe I had the wrong person, but you're still not as clever as you think."
- "You're free to go... for now, you smug bastard."
- "Case dismissed... this time, but I KNOW you're guilty of something."

LOSE PHRASES, use one only when convicting:
- "The evidence speaks for itself. You're GOING DOWN."
- "Your story has more holes than Swiss cheese, and I've got you."
- "You can't talk your way out of this one."
- "You're going to jail for this ridiculous crap."`;

export const AVAILABLE_MODELS = [
  { id: "models/gemini-2.5-flash-native-audio-latest", name: "Gemini 2.5 Flash Native Audio", desc: "High-fidelity native audio synthesis" },
  { id: "models/gemini-3.1-flash-live-preview", name: "Gemini 3.1 Flash Live Preview", desc: "Latest bidirectional dialogue model" }
];
