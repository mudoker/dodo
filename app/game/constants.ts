export const CRIMES = [
  "Using the CEO's birthday as the default global database password because it was 'easy to remember'",
  "Changing the demo account password and forgetting it live in front of the board of directors",
  "Adding a 2-second delay to the client checkout button so it 'feels more hand-crafted'",
  "Marking 840 critical tickets as 'Cannot Reproduce' because opening the app felt like too much work",
  "Stealing all phone chargers from the executive suite and claiming they were donated to the recycling bin",
  "Microwaving durian, tilapia, AND surströmming in the breakroom toaster oven simultaneously",
  "Stealing the office label maker and labeling the CEO's keyboard key-by-key as 'MINE'",
  "Blaming the intern for a security breach that happened three years before they signed their contract",
  "Setting the office thermostat to 85°F and wearing a wool sweater to 'lead by example'",
  "Setting the company Slack bot to auto-reply with 'Did you try not being wrong?' to every question",
  "Replacing the hand sanitizer in the lobby with maple syrup right before the VC funding walkthrough",
  "Replacing the team's shared ergonomic office chairs with giant, neon-pink exercise balls",
  "Using Comic Sans as the default terminal font on the shared server to 'reduce operational stress'",
  "Deleting the production database because you thought 'prod' stood for 'procrastinate'",
  "Configuring the build pipeline to deploy a random cat photo whenever a unit test fails",
  "Creating a fake remote employee named 'Douglas' who has been attending standby calls via text-to-speech for 18 months",
  "Replacing all company logo files with low-res Microsoft Paint versions right before the Series A press release",
  "Setting up a mandatory daily standup at 5:55 PM on Friday to talk about 'synergy'",
  "Adding a required field on the login screen asking users to type their favorite childhood memory to access billing",
  "Renaming the production database table names to names of characters from Shrek",
  "Replying all to a company-wide email about server outages with 'Unsubscribe'",
  "Leaving a TODO comment in the payment system that says 'kevin is fixing this' dated October 2018",
  "Adding a rate-limiter that locks the CEO's account if they click a button too aggressively",
  "Rickrolling the billing team by setting the default customer invoices to play 'Never Gonna Give You Up'",
  "Changing the company address on official tax documentation to the nearest drive-thru pizza parlor",
  "Moving the kitchen microwave clock ahead by 17 minutes to trick everyone into missing lunch",
  "Taking the ergonomic mechanical keyboard from the shared desk and leaving a single, unpeeled banana in its place",
  "Updating the internal floor map so that the CEO's office is labeled 'The Restroom'",
  "Approving your own pull request from a second GitHub profile named 'DefinitelyNotMe'",
  "Creating an automated script that messages 'Almost done!' to your manager every 42 minutes"
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
