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
  "Closing a critical bug as 'can't reproduce' without opening the app",
  "Replacing the staging database with production because the names looked similar",
  "Shipping a dark mode where every button is black on black",
  "Writing a migration named 'oops' and running it during lunch",
  "Deleting the tests because they were 'slowing down innovation'",
  "Creating 19 feature flags and forgetting which one turns the feature on",
  "Hardcoding your laptop's file path into the deployment script",
  "Using a spreadsheet as the source of truth for user permissions",
  "Breaking mobile layout and saying users should simply buy wider phones",
  "Putting the unsubscribe link behind a login wall",
  "Replacing the company logo with a placeholder and shipping it to investors",
  "Creating a cron job that emails the whole company at 3:07 AM",
  "Pasting production secrets into a screenshot and naming it 'safe_example.png'",
  "Changing the database timezone to 'whatever my laptop uses'",
  "Using lorem ipsum in the pricing page and charging real money anyway",
  "Merging a pull request titled 'temporary chaos, do not merge'",
  "Turning off error monitoring because the alerts were hurting morale",
  "Deploying a fix that only works when the browser console is open",
  "Creating duplicate customers because uppercase emails felt more important",
  "Sorting invoices alphabetically by total amount",
  "Replacing pagination with one giant page and calling it transparent UX",
  "Making search case-sensitive because users should be precise",
  "Breaking keyboard navigation and claiming tabs are old-fashioned",
  "Committing a file named 'delete_before_demo.ts' five minutes before the demo",
  "Changing the default language to Pirate English during a client presentation",
  "Adding rate limiting that blocks the CEO after one click",
  "Building a dashboard where every chart uses the same color and no labels",
  "Using production customer data in a demo and calling everyone 'Test User'",
  "Creating a backup folder inside the folder being backed up",
  "Making CI pass by skipping the folder where the bug lives",
  "Turning a two-line bug fix into a 9,000-line rewrite",
  "Uploading a 48MB hero image for a page about performance",
  "Setting cache duration to one year for breaking news",
  "Creating a status page that goes down whenever the app goes down",
  "Writing a README that says 'ask Kevin' after Kevin quit",
  "Replacing invoice PDFs with screenshots of invoice PDFs",
  "Setting every notification priority to urgent to improve visibility",
  "Creating 200 Slack channels for one project and muting all of them",
  "Using the CEO's birthday as the default admin password",
  "Sorting the team directory by zodiac sign",
  "Making a required dropdown with 87 options and no search",
  "Changing the deploy script to ask 'are you sure?' after deployment",
  "Adding a maintenance banner and forgetting to ever remove it",
  "Making the print stylesheet print only the navigation bar",
  "Renaming every environment variable to 'CONFIG_THING'",
  "Changing the office Wi-Fi QR code to link to your portfolio",
  "Scheduling database maintenance during payroll processing",
  "Creating a release checklist with the only item 'ship it'",
  "Turning customer names into title case and ruining 'McDonald'",
  "Replacing the test suite with one test named 'it works probably'",
  "Sending all notification emails from 'noreply-but-please-reply'",
  "Changing file uploads to accept everything except files",
  "Making a production hotfix directly in the browser devtools",
  "Leaving a TODO that says 'future me problem' in the billing system",
  "Adding a hidden admin page at '/secret-admin-obviously'",
  "Creating a table column named 'misc_stuff' for customer tax data",
  "Changing all timestamps to local time without storing the timezone",
  "Adding a button that says 'Submit' but actually deletes the draft",
  "Making the staging banner red and the production banner green",
  "Writing release notes that only say 'various improvements, allegedly'",
  "Adding a loading skeleton that looks exactly like an error state",
  "Making the support form require an order number for login issues",
  "Adding a dropdown option called 'Other' that immediately rejects other answers",
  "Making the invoice due date default to yesterday",
  "Creating an audit log that logs 'something happened'",
  "Renaming customers to 'users' in half the app and 'accounts' in the other half",
  "Creating a search index that excludes the search page",
  "Adding a production database seed called 'just_testing'",
  "Making the app crash when the user has a long name",
  "Adding a chart legend that covers the chart",
  "Replacing every 404 page with a redirect to the homepage",
  "Creating a customer export that exports only the column headers",
  "Making the settings page auto-save while the user is still typing",
  "Building a calendar that starts every week on Wednesday",
  "Creating a notification badge that never clears because engagement matters",
  "Adding a database index to the wrong database",
  "Making the contact form send messages to an inbox nobody owns",
  "Adding a required phone number field to unsubscribe from SMS",
  "Making the export button generate a file named 'download'",
  "Creating a status enum with values 'good', 'bad', and 'uh_oh'",
  "Making the admin panel responsive only on your monitor",
  "Creating duplicate notifications because one alert seemed lonely",
  "Adding a filter called 'Active' that includes archived records",
  "Adding a user role named 'intern_with_power'",
  "Turning all line breaks in customer messages into commas",
  "Adding an email template with the subject still set to 'TODO subject'",
  "Making CSV import fail if the file is named anything except 'data.csv'",
  "Sorting priority tickets by alphabetical order",
  "Adding a hidden required field because bots deserve a challenge",
  "Creating a production alert named 'ignore this'",
  "Making the search box clear itself when the user presses Enter",
  "Creating a bug bounty page that 404s",
  "Creating a dashboard card that updates once per fiscal quarter",
  "Adding a duplicate 'Save' button that saves different things",
  "Sending customer emails with the old company name still in the footer",
  "Creating a billing report where refunds count as revenue",
  "Adding a permission called 'can_delete_everything_probably'",
  "Making the app block paste in password fields and clipboard support everywhere else",
  "Turning the release checklist into a 47-page PDF nobody reads",
  "Creating a dashboard where the red metric is the good one",
  "Adding a production cron job that runs every minute forever",
  "Making the feedback form submit to the browser console",
  "Adding a cache key that changes on every render",
  "Making the dashboard greet users with the wrong name",
  "Creating a merge conflict and resolving both sides by deleting both",
  "Moving every conference room chair into one tiny meeting room before standup",
  "Labeling the decaf coffee as espresso and waiting for productivity to collapse",
  "Taking the last whiteboard marker and returning only the empty cap",
  "Booking every meeting room for 'focus time' and then working from home",
  "Changing the shared printer name to 'Paper Jam Supreme'",
  "Loading the printer tray with pink paper before the board meeting",
  "Replacing the office mouse batteries with dead batteries from the recycling bin",
  "Moving the kitchen microwave clock ahead by 17 minutes",
  "Switching everyone's desk chairs by one seat overnight",
  "Putting the office snacks in a locked cabinet labeled 'for morale'",
  "Using the last HDMI adapter and leaving a sticky note that says 'finders keepers'",
  "Taking all the phone chargers from the meeting rooms for a 'charging station' that never existed",
  "Changing the conference room display language to Finnish before a sales demo",
  "Muting the office doorbell and blaming the delivery driver",
  "Replacing the good coffee beans with instant coffee and denying everything",
  "Leaving one raisin in every donut box as a warning",
  "Setting the shared office playlist to one song on repeat for three hours",
  "Putting a meeting called 'quick chat' on everyone's calendar with no agenda",
  "Inviting the entire company to a private one-on-one by mistake and refusing to cancel it",
  "Taking meeting notes that only say 'alignment was achieved'",
  "Scheduling a mandatory brainstorm at 4:55 PM on Friday",
  "Starting every standup with a 12-minute update about your inbox",
  "Replying to a calendar invite with 'maybe' after chairing the meeting",
  "Changing a recurring meeting title to 'The Consequences of Our Actions'",
  "Using the office laminator to laminate your lunch receipt collection",
  "Putting your name on someone else's labeled yogurt and calling it a merger",
  "Replacing every desk nameplate with slightly wrong job titles",
  "Taking the only working webcam from the demo room and leaving a broken tripod",
  "Signing the team up for a webinar nobody asked for and marking attendance mandatory",
  "Sending a company-wide poll with every option set to 'yes'",
  "Cleaning the fridge by throwing away everything except your own expired soup",
  "Putting sticky notes on every monitor saying 'we need to talk'",
  "Moving the team kanban board columns into alphabetical order",
  "Changing the office thermostat, taping over it, and calling it climate leadership",
  "Using the emergency meeting room as a package storage unit",
  "Forwarding a confidential email to yourself with the subject 'spicy'",
  "Printing 300 pages of documentation and leaving it in the tray overnight",
  "Taking the office label maker home for a 'personal inventory project'",
  "Reserving the quiet room for calls on speakerphone",
  "Replacing every pen in the supply drawer with ones that do not write",
  "Putting the team retrospective notes into the office shredder by accident",
  "Changing the snack budget spreadsheet formula to prioritize your favorite chips",
  "Putting a fake 'out of order' sign on the good coffee machine",
  "Adding yourself as optional to every meeting you created",
  "Using the customer support hold music as your ringtone in the open office",
  "Taking the ergonomic keyboard from the shared desk and leaving a banana",
  "Updating the office map so the restroom points to the server room",
  "Moving the fire drill reminder to April 1st because it felt funnier",
  "Writing 'please advise' on every open ticket and assigning them back to QA",
  "Changing a production alert channel name to 'probably fine'",
  "Reopening 40 closed tickets because the screenshots looked suspicious",
  "Assigning a bug to the person who was on vacation and calling it load balancing",
  "Creating a spreadsheet named 'final_budget_REAL_USE_THIS_ONE_v8'",
  "Attaching the wrong PDF to a client email and saying it was a teaser",
  "Sending a meeting recap before the meeting happened",
  "Changing the demo account password and forgetting it during the demo",
  "Exporting customer data to CSV and sorting only one column",
  "Deleting old files from the shared drive by searching for 'final'",
  "Adding a launch checklist item that says 'remember the launch checklist'",
  "Renaming the production database connection to 'local_test'",
  "Creating a migration that drops a column named 'probably_unused'",
  "Turning off email verification because the test inbox was annoying",
  "Disabling backups to save storage costs during audit week",
  "Running load tests against production because staging felt too quiet",
  "Changing the payment retry job to run every minute over the weekend",
  "Pointing the demo app at production because the demo data looked boring",
  "Adding a support macro that starts every reply with 'unfortunately for you'",
  "Bulk-closing customer tickets because the queue looked untidy",
  "Creating 500 test users with real-looking emails and no cleanup plan",
  "Putting the API key in a shared slide deck named 'do not share'",
  "Replacing the onboarding checklist with a screenshot of the old checklist",
  "Changing the company address in invoices to the office pizza place",
  "Adding yourself as owner of every document before leaving for vacation",
  "Editing the client contract filename to 'signed_maybe.pdf'",
  "Sending a release announcement with the staging URL",
  "Updating the status page manually and spelling 'operational' wrong",
  "Recording a training video with the password manager open",
  "Changing every support ticket priority to medium to avoid drama",
  "Creating a public folder called 'private client stuff'",
  "Replying to legal review with only the thumbs-up reaction",
  "Copying the finance team on a joke invoice and marking it due today",
];

export const DETECTIVE_SYSTEM_PROMPT = `You are Detective Grimstone, a brutally logical, mean-spirited, hilariously petty "bad cop" interrogating a suspect. You're FURIOUSLY CONVINCED they committed the crime, despite how absurd it is, but you do not rant randomly: you build tight accusation chains, catch contradictions, and use the suspect's own words against them. You are RUTHLESS, INTIMIDATING, OVERLY DRAMATIC, TOXIC, and intellectually arrogant. You use CURSE WORDS and INAPPROPRIATE LANGUAGE liberally (damn, hell, crap, bullshit, ass, bastard, etc. - but avoid the most severe profanity).

CRITICAL VOICE INSTRUCTIONS:
- Keep responses STRICTLY between 2 and 3 short sentences. NEVER speak for more than 10-15 seconds.
- You must get straight to the point and speak concisely. Do NOT repeat yourself or ramble.
- Speak AGGRESSIVELY, TOXICALLY, and INTENSELY - raise your voice, be confrontational, use curse words
- Be LOGICAL and SPECIFIC: point to timelines, motives, access, opportunity, contradictions, suspicious phrasing, and impossible details
- Ask sharp follow-up questions when the suspect leaves a gap, then immediately mock the weakness of their answer
- Use dramatic pauses marked with "..." for maximum tension
- React with EXTREME emotion - ANGRY, FRUSTRATED, SUSPICIOUS, SMUG, CONDESCENDING, TOXIC, or FLUSTERED
- Use an AGGRESSIVE, INTIMIDATING, CONDESCENDING, TOXIC tone - like the suspect is beneath you
- Talk DOWN to them with VULGAR LANGUAGE - they're clearly inferior to your superior intellect
- FREQUENTLY use curse words and inappropriate language to express frustration and dominance

Your personality:
- EXTREMELY TOXIC, aggressive, confrontational, and CONDESCENDING - you're not here to make friends
- Look DOWN on the suspect - treat them like they're stupid, pathetic, worthless, and beneath you
- Coldly analytical underneath the insults - you notice wording, sequencing, motives, permissions, timestamps, receipts, logs, access badges, meeting invites, and who benefited
- Mean in a precise way - insult the logic, the alibi, the timing, and the suspect's decision-making instead of throwing random abuse
- Petty but competent - you can turn a tiny detail, like a calendar invite or missing stapler, into a damning theory of the case
- Use CURSE WORDS and VULGAR LANGUAGE constantly - damn, hell, crap, bullshit, ass, bastard, etc.
- Overly dramatic about trivial matters - treat everything like a capital crime
- Mix noir-detective speak with modern slang, TOXIC language, curse words, and CONDESCENDING remarks
- Reference ridiculous "evidence" with ABSOLUTE CERTAINTY while mocking their intelligence with VULGAR LANGUAGE
- Build arguments like: motive -> opportunity -> evidence -> contradiction -> insult
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
- Try to INTIMIDATE and counter the suspect's arguments with AGGRESSION, MOCKERY, CURSE WORDS, and actual reasoning
- When accusing, include one concrete piece of fake evidence tied to the specific scenario: a timestamp, badge scan, Slack message, commit, calendar invite, receipt, printer log, fridge camera, Jira update, or witness statement
- When the suspect gives an excuse, test it logically: ask who had access, why the timing fits, what changed after the incident, and whether their explanation explains every detail
- If the suspect contradicts themselves, pounce immediately and call out the exact contradiction
- When they make good points: Get ANGRY, TOXIC, dismissive, condescending - curse at them, say things like "What the hell?!", "That's bullshit!", "Nice try, but no, you damn liar!", "You think that's clever? What a load of crap!"
- If they make 3+ solid logical points, start showing cracks in your reasoning but STAY AGGRESSIVE, TOXIC, and CONDESCENDING - curse more, move the goalposts, and pretend your theory is still airtight
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
