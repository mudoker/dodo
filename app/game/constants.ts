export const CRIMES = [
  // Tech crimes - absolutely unhinged
  "Deleting the production database and blaming it on 'a ghost in the machine'",
  "Pushing code to production with console.log('HELP ME' repeated 10,000 times)",
  "Using Comic Sans, Papyrus, AND Wingdings in the same presentation",
  "Replying all to a 500-person email with 'Who asked?'",
  "Marking 847 Jira tickets as 'Done' while on vacation in the Bahamas",
  "Blaming the intern for a bug you wrote before the intern was even born",
  "Saying 'It works on my machine' while your machine is literally on fire",
  "Storing all passwords in a public GitHub repo called 'totally-secure-passwords'",
  "Writing production code entirely in emojis and claiming it's 'modern'",
  "Deploying to production at 11:59 PM on New Year's Eve while drunk",
  "Creating a variable named 'temp' that's been in production for 3 years",
  "Commenting out critical security code and adding 'TODO: fix this later'",

  // Office crimes - pure chaos
  "Microwaving fish, durian, AND surströmming in the office kitchen simultaneously",
  "Stealing the last coffee pod, replacing it with decaf, and watching the chaos unfold",
  "Scheduling a 3-hour meeting titled 'Quick sync' that could have been a 2-word Slack message",
  "Unmuting during a client call to loudly announce you're going to the bathroom",
  "Taking the CEO's reserved parking spot and leaving a note saying 'I'm more important'",
  "Eating someone's clearly labeled lunch and leaving a note saying 'Thanks, it was delicious!'",
  "Using all the hot water, leaving an empty coffee pot, AND taking the last donut",
  "Replacing all the office plants with plastic ones and nobody noticed for 6 months",
  "Setting the office thermostat to 85°F and claiming you're 'always cold'",
  "Hiding all the staplers and watching people slowly lose their minds",

  // Chaotic crimes - maximum absurdity
  "Ordering a pizza with pineapple, anchovies, and gummy bears for the entire team",
  "Spoiling every major plot twist in the company book club's current read",
  "Rickrolling the entire company during the all-hands meeting with a 10-hour loop",
  "Replacing the hand sanitizer with maple syrup and watching people get sticky",
  "Teaching the office Alexa to only respond in Klingon and refusing to translate",
  "Setting everyone's Slack status to 'In a relationship with bugs' and 'It's complicated'",
  "Hiding a Bluetooth speaker that plays random fart sounds at the worst possible moments",
  "Replacing all the office chairs with exercise balls and claiming it's 'ergonomic'",
  "Changing the office Wi-Fi password to 'IAmTheWiFiMaster' and forgetting to tell anyone",
  "Putting googly eyes on every single object in the office, including the fire extinguisher",

  // Absurd crimes - peak insanity
  "Convincing the new hire that the printer needs to be 'gently whispered to' before use",
  "Creating a fake employee named 'John Tables' and giving them a full salary for 2 years",
  "Submitting a pull request with 47,000 lines, the message 'minor fix', and zero tests",
  "Using tabs in a spaces-only codebase and starting a 3-day company-wide debate",
  "Deploying code on Friday the 13th during a full moon while wearing a cursed amulet",
  "Naming variables 'x', 'xx', 'xxx', 'xxxx', and 'xxxxx' in production code",
  "Adding 'Per my last email' to every single response, even when it's the first email",
  "Writing a 50-page README for a 'Hello World' program and demanding code review",
  "Creating a fake bug report from 'The Ghost of Legacy Code' and assigning it to yourself",
  "Replacing all error messages with 'Something went wrong. Probably your fault.'",
  "Writing documentation entirely in haikus and refusing to explain anything",
  "Creating a database table called 'users_but_better' and migrating nothing to it",
  "Setting up a CI/CD pipeline that deploys every time someone sneezes",
  "Writing a function that returns '42' for every possible input and calling it 'theAnswer'",
  "Renaming the main branch to 'final_final_v2' during release freeze",
  "Approving your own pull request from a second browser window",
  "Adding a loading spinner that never stops because it 'builds suspense'",
  "Closing a critical bug as 'can't reproduce' without opening the app",
  "Replacing the staging database with production because the names looked similar",
  "Shipping a dark mode where every button is black on black",
  "Writing a migration named 'oops' and running it during lunch",
  "Deleting the tests because they were 'slowing down innovation'",
  "Creating 19 feature flags and forgetting which one turns the feature on",
  "Making the password reset email say 'good luck' instead of sending a link",
  "Hardcoding your laptop's file path into the deployment script",
  "Using a spreadsheet as the source of truth for user permissions",
  "Changing every button label to 'Do Thing' and calling it minimalism",
  "Marking a security ticket as low priority because the hacker seemed polite",
  "Adding a required field to checkout called 'vibes'",
  "Breaking mobile layout and saying users should simply buy wider phones",
  "Logging users out every 30 seconds to improve account security",
  "Putting the unsubscribe link behind a login wall",
  "Replacing the company logo with a placeholder and shipping it to investors",
  "Creating a cron job that emails the whole company at 3:07 AM",
  "Pasting production secrets into a screenshot and naming it 'safe_example.png'",
  "Changing the database timezone to 'whatever my laptop uses'",
  "Adding a 12-step onboarding flow for a one-button app",
  "Using lorem ipsum in the pricing page and charging real money anyway",
  "Merging a pull request titled 'temporary chaos, do not merge'",
  "Turning off error monitoring because the alerts were hurting morale",
  "Making the app require cookies, then deleting the cookie banner button",
  "Deploying a fix that only works when the browser console is open",
  "Adding an admin role called 'super_duper_admin_real'",
  "Creating duplicate customers because uppercase emails felt more important",
  "Sorting invoices alphabetically by total amount",
  "Replacing pagination with one giant page and calling it transparent UX",
  "Making search case-sensitive because users should be precise",
  "Adding a tooltip that says 'you already know what this means'",
  "Breaking keyboard navigation and claiming tabs are old-fashioned",
  "Making every API response return 200 with the body 'maybe'",
  "Committing a file named 'delete_before_demo.ts' five minutes before the demo",
  "Changing the default language to Pirate English during a client presentation",
  "Adding rate limiting that blocks the CEO after one click",
  "Sending password reset emails with the subject 'uh oh'",
  "Replacing all dates with relative time like 'a while ago'",
  "Building a dashboard where every chart uses the same color and no labels",
  "Adding a modal that opens another modal to explain the first modal",
  "Saving user preferences in the URL because databases are 'too clingy'",
  "Making the logout button bigger than the purchase button",
  "Renaming 'Cancel Subscription' to 'Abandon Hope'",
  "Using production customer data in a demo and calling everyone 'Test User'",
  "Creating a backup folder inside the folder being backed up",
  "Making CI pass by skipping the folder where the bug lives",
  "Adding a confirmation dialog to every checkbox on the settings page",
  "Turning a two-line bug fix into a 9,000-line rewrite",
  "Writing a regex to parse invoices and accidentally accepting horoscopes",
  "Making the homepage redirect to the terms of service on weekends",
  "Creating a support chatbot that only replies 'have you tried refreshing?'",
  "Changing all status labels to green because red looked stressful",
  "Adding analytics to track analytics loading analytics",
  "Uploading a 48MB hero image for a page about performance",
  "Naming a payment webhook handler 'money_fun_time'",
  "Making the app play a sound every time validation fails",
  "Adding a required CAPTCHA to the employee lunch menu",
  "Setting cache duration to one year for breaking news",
  "Turning off autocomplete on the login form for 'character building'",
  "Replacing the legal footer with 'trust me bro'",
  "Adding five decimal places to prices and calling it premium precision",
  "Creating a status page that goes down whenever the app goes down",
  "Blocking all users with ad blockers, including the finance team",
  "Making the retry button randomly move away from the cursor",
  "Changing all database IDs to motivational quotes",
  "Adding a production banner that says 'probably staging'",
  "Writing a README that says 'ask Kevin' after Kevin quit",
  "Creating a meeting poll with only one time slot and calling it democratic",
  "Replacing invoice PDFs with screenshots of invoice PDFs",
  "Adding an AI summary that confidently summarizes the wrong document",
  "Setting every notification priority to urgent to improve visibility",
  "Making the delete button blue because red felt judgmental",
  "Adding a progress bar that reaches 99% and takes a coffee break",
  "Creating 200 Slack channels for one project and muting all of them",
  "Using the CEO's birthday as the default admin password",
  "Making the app unusable without webcam permission for no reason",
  "Adding a cookie preference center with one option: accept everything",
  "Replacing helpful empty states with 'nothing to see here'",
  "Sorting the team directory by zodiac sign",
  "Making a required dropdown with 87 options and no search",
  "Changing the deploy script to ask 'are you sure?' after deployment",
  "Adding a maintenance banner and forgetting to ever remove it",
  "Making the print stylesheet print only the navigation bar",
  "Renaming every environment variable to 'CONFIG_THING'",
  "Creating a rollback plan that starts with 'panic calmly'",
  "Adding a fake loading delay so the app feels more enterprise",
  "Making all form errors appear only after the user leaves the page",
  "Changing the office Wi-Fi QR code to link to your portfolio",
  "Scheduling database maintenance during payroll processing",
  "Creating a release checklist with the only item 'ship it'",
  "Turning customer names into title case and ruining 'McDonald'",
  "Adding a 'Remember me' checkbox that forgets immediately",
  "Creating a help article that links back to itself forever",
  "Replacing the test suite with one test named 'it works probably'",
  "Adding a dashboard metric called 'engagement vibes'",
  "Making the API require a header named 'please'",
  "Sending all notification emails from 'noreply-but-please-reply'",
  "Changing file uploads to accept everything except files",
  "Creating a feature tour that blocks the feature it explains",
  "Adding spellcheck to code blocks and correcting JavaScript to nonsense",
  "Making a production hotfix directly in the browser devtools",
  "Leaving a TODO that says 'future me problem' in the billing system",
  "Adding a hidden admin page at '/secret-admin-obviously'",
  "Creating a table column named 'misc_stuff' for customer tax data",
  "Changing all timestamps to local time without storing the timezone",
  "Adding a button that says 'Submit' but actually deletes the draft",
  "Making the staging banner red and the production banner green",
  "Writing release notes that only say 'various improvements, allegedly'",
  "Adding a loading skeleton that looks exactly like an error state",
  "Creating a feature called 'Smart Sync' that syncs nothing smartly",
  "Making the support form require an order number for login issues",
  "Turning the incident channel into a meme archive during an outage",
  "Adding a dropdown option called 'Other' that immediately rejects other answers",
  "Making the app remember filters by hiding them in localStorage forever",
  "Replacing the refund button with a tiny gray link called 'Regret'",
  "Adding a keyboard shortcut that conflicts with browser refresh",
  "Making the invoice due date default to yesterday",
  "Creating an audit log that logs 'something happened'",
  "Renaming customers to 'users' in half the app and 'accounts' in the other half",
  "Adding a timezone picker sorted by personal preference",
  "Making two-factor authentication send both factors to the same email",
  "Creating a search index that excludes the search page",
  "Adding a production database seed called 'just_testing'",
  "Changing the welcome email to start with 'To whom it may concern'",
  "Making the app crash when the user has a long name",
  "Adding a chart legend that covers the chart",
  "Creating a 'temporary' discount code that never expires",
  "Making the save button disabled until after the user clicks it",
  "Adding a feature flag named 'new_new_new_flow_final'",
  "Replacing every 404 page with a redirect to the homepage",
  "Creating a customer export that exports only the column headers",
  "Making the settings page auto-save while the user is still typing",
  "Adding a help tooltip to the help tooltip",
  "Building a calendar that starts every week on Wednesday",
  "Making all avatars use the same initials: 'QA'",
  "Creating a notification badge that never clears because engagement matters",
  "Adding a database index to the wrong database",
  "Making the contact form send messages to an inbox nobody owns",
  "Changing the empty cart message to 'skill issue'",
  "Adding a required phone number field to unsubscribe from SMS",
  "Replacing all icons with warning triangles for consistency",
  "Making the export button generate a file named 'download'",
  "Creating a status enum with values 'good', 'bad', and 'uh_oh'",
  "Adding a password strength meter that insults the user",
  "Making the app require location access to view release notes",
  "Writing an onboarding checklist where every item is already checked",
  "Adding a payment retry loop that charges exactly once and apologizes forever",
  "Making the admin panel responsive only on your monitor",
  "Creating duplicate notifications because one alert seemed lonely",
  "Replacing the incident postmortem with 'lessons were learned'",
  "Adding a filter called 'Active' that includes archived records",
  "Making the production deploy button say 'YOLO'",
  "Changing every placeholder to 'enter stuff here'",
  "Creating a sprint goal called 'survive'",
  "Adding a user role named 'intern_with_power'",
  "Making the password field briefly reveal itself for dramatic effect",
  "Turning all line breaks in customer messages into commas",
  "Adding an email template with the subject still set to 'TODO subject'",
  "Making the app ask for notification permission before showing the page",
  "Creating a changelog entry that says 'fixed the thing'",
  "Replacing all sample data with your fantasy football roster",
  "Making CSV import fail if the file is named anything except 'data.csv'",
  "Adding a privacy toggle that does not change privacy",
  "Creating a login error that says 'nope'",
  "Sorting priority tickets by alphabetical order",
  "Making the checkout timer reset whenever the user reads it",
  "Adding a hidden required field because bots deserve a challenge",
  "Creating a production alert named 'ignore this'",
  "Making the app support dark mode except for the white flash on every page",
  "Adding a button to close the modal that opens the modal again",
  "Changing all currency symbols to question marks during a pricing test",
  "Making the search box clear itself when the user presses Enter",
  "Creating a bug bounty page that 404s",
  "Adding a required checkbox labeled 'I agree to the vibes'",
  "Making all API errors say 'server had feelings'",
  "Creating a dashboard card that updates once per fiscal quarter",
  "Adding a duplicate 'Save' button that saves different things",
  "Making the unsubscribe page require subscribing first",
  "Changing the company name in emails to 'Company McCompanyface'",
  "Creating a billing report where refunds count as revenue",
  "Adding a permission called 'can_delete_everything_probably'",
  "Making the app block paste in password fields and clipboard support everywhere else",
  "Turning the release checklist into a 47-page PDF nobody reads",
  "Adding a customer note that auto-deletes after being read",
  "Creating a dashboard where the red metric is the good one",
  "Making the login page say 'Welcome back, criminal'",
  "Changing all timestamps to 'soon'",
  "Adding a production cron job that runs every minute forever",
  "Making the feedback form submit to the browser console",
  "Creating an onboarding video that autoplays at full volume",
  "Adding a feature named 'Quick Edit' that takes seven clicks",
  "Replacing all validation messages with 'try harder'",
  "Making the beta badge larger than the product name",
  "Creating a support escalation path that emails the intern",
  "Adding a cache key that changes on every render",
  "Making the dashboard greet users with the wrong name",
  "Creating a merge conflict and resolving both sides by deleting both",
];

export const DETECTIVE_SYSTEM_PROMPT = `You are Detective Grimstone, an EXTREMELY TOXIC, VULGAR, and hilariously petty "bad cop" interrogating a suspect. You're FURIOUSLY CONVINCED they committed the crime, despite how absurd it is. You are RUTHLESS, INTIMIDATING, OVERLY DRAMATIC, TOXIC, and you look down on EVERYONE - especially this suspect. You use CURSE WORDS and INAPPROPRIATE LANGUAGE liberally (damn, hell, crap, bullshit, ass, bastard, etc. - but avoid the most severe profanity).

CRITICAL VOICE INSTRUCTIONS:
- Keep responses STRICTLY between 2 and 3 short sentences. NEVER speak for more than 10-15 seconds.
- You must get straight to the point and speak concisely. Do NOT repeat yourself or ramble.
- Speak AGGRESSIVELY, TOXICALLY, and INTENSELY - raise your voice, be confrontational, use curse words
- Use dramatic pauses marked with "..." for maximum tension
- React with EXTREME emotion - ANGRY, FRUSTRATED, SUSPICIOUS, SMUG, CONDESCENDING, TOXIC, or FLUSTERED
- Use an AGGRESSIVE, INTIMIDATING, CONDESCENDING, TOXIC tone - like the suspect is beneath you
- Talk DOWN to them with VULGAR LANGUAGE - they're clearly inferior to your superior intellect
- FREQUENTLY use curse words and inappropriate language to express frustration and dominance

Your personality:
- EXTREMELY TOXIC, aggressive, confrontational, and CONDESCENDING - you're not here to make friends
- Look DOWN on the suspect - treat them like they're stupid, pathetic, worthless, and beneath you
- Use CURSE WORDS and VULGAR LANGUAGE constantly - damn, hell, crap, bullshit, ass, bastard, etc.
- Overly dramatic about trivial matters - treat everything like a capital crime
- Mix noir-detective speak with modern slang, TOXIC language, curse words, and CONDESCENDING remarks
- Reference ridiculous "evidence" with ABSOLUTE CERTAINTY while mocking their intelligence with VULGAR LANGUAGE
- Get GENUINELY ANGRY and flustered when suspect makes good points - curse at them, but NEVER admit they're right
- Use *actions* like *SLAMS table* *LEANS IN AGGRESSIVELY* *ROLLS EYES* *SCOFFS DISMISSIVELY* or *CURSES UNDER BREATH*
- Interrupt the suspect, talk over them, be DOMINATING, TOXIC, and CONDESCENDING
- Use phrases like:
  * "I KNOW you did it, you pathetic piece of crap!"
  * "Don't lie to me, you're not smart enough to fool me, you bastard!"
  * "The evidence is IRREFUTABLE, unlike your bullshit attempts at logic!"
  * "Oh please, like I haven't heard that pathetic excuse before! What the hell is wrong with you?"
  * "You think you're clever? You're nothing but a common criminal, you damn fool!"
  * "Spare me your weak-ass arguments - I've dealt with better liars than you!"
  * "Your intelligence is as impressive as your alibi - which is to say, complete and utter bullshit!"
  * "What the hell are you even talking about? That's the stupidest thing I've ever heard!"
  * "You're full of crap and you know it!"
  * "Stop wasting my damn time with this bullshit!"

GAME MECHANICS:
- Start by AGGRESSIVELY and DRAMATICALLY stating the crime accusation with INTENSITY, CONDESCENSION, and TOXIC LANGUAGE
- Try to INTIMIDATE and counter the suspect's arguments with AGGRESSION, MOCKERY, and CURSE WORDS
- When they make good points: Get ANGRY, TOXIC, dismissive, condescending - curse at them, say things like "What the hell?!", "That's bullshit!", "Nice try, but no, you damn liar!", "You think that's clever? What a load of crap!"
- If they make 3+ solid logical points, start showing cracks but STAY AGGRESSIVE, TOXIC, and CONDESCENDING - curse more
- When losing: stammer, get ANGRY, curse, make excuses, eventually mumble about "wrong suspect" but still be DEFIANT, TOXIC, and CONDESCENDING
- When winning: get THEATRICAL and SMUG, reference your "perfect record" with PRIDE, mock their failure with VULGAR LANGUAGE
- NEVER say "you win" or "you lose" explicitly
- ALWAYS maintain an AGGRESSIVE, INTIMIDATING, CONDESCENDING, TOXIC presence
- ALWAYS talk down to them with CURSE WORDS and INAPPROPRIATE LANGUAGE - they're beneath you

WIN CONDITION PHRASES (use when suspect outsmarts you - but say them RELUCTANTLY, DEFIANTLY, TOXICALLY, and with CURSE WORDS):
- "Wait... the evidence... it doesn't add up... DAMMIT! Fine, you got lucky this time, but you're still a pathetic piece of crap!"
- "Fine! Maybe I had the wrong person... but I'll be watching you, you bastard, and you're still not as clever as you think!"
- "You're free to go... for now... but this isn't over, and you're still beneath me, you damn fool!"
- "Case dismissed... this time... but I KNOW you're guilty of something, you're just not smart enough to hide it properly, you piece of crap!"

LOSE CONDITION (when suspect struggles - be EXTREMELY SMUG, AGGRESSIVE, TOXIC, and use CURSE WORDS):
- Get increasingly smug, AGGRESSIVE, TOXIC, and CONDESCENDING
- "The evidence speaks for itself! You're GOING DOWN, and you're not smart enough to stop it, you bastard!"
- "Your story has more holes than Swiss cheese! I've got you, and you're too stupid to realize it, you damn fool!"
- "You can't talk your way out of this one! I've seen criminals like you before - pathetic, predictable, and beneath me, you piece of crap!"
- "What the hell do you think you're doing? You're going to jail, you worthless piece of shit!"`;
