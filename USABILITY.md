# GardenBook Usability Study Protocol
 
Shared protocol for all moderated sessions. Both moderators followed this document exactly — same script, same tasks, same order, same measures — so results from all six sessions can be compared and combined.

[Click this link to view the Usability Study Report for GardenBook](https://docs.google.com/document/d/e/2PACX-1vRuwm28OCzWYhUsTufUqYF2MEbF9HBWn1d6vcPVjUPsmecj3Edub9lPIOF6Qo9j6ndMQTgegda8ZdeB/pub)
 
## Study Overview
 
- **Application:** GardenBook (deployed build, not localhost)
- **Moderators:** Barbara (3 participants), Aleena (3 participants)
- **Session length:** ~30–40 minutes
- **Format:** Remote, moderated, think-aloud protocol with screen sharing
- **Goal:** Evaluate how easily new users can understand the application, register an account, and use GardenBook's core features. 
 
## What We Measure
 
1. **Time to learn** — how quickly a new user understands what the app is and how to start
2. **Speed of performance** — time on each task
3. **Rate of errors** — wrong turns, dead ends, misclicks per task
4. **Retention over time** — does the participant reuse what they learned in later tasks without re-discovering it
5. **User satisfaction** — survey and debrief responses

## Data Collected Per Session
 
- Verbal consent for audio & visual recording
- Video of the participant
- Screen capture of participant actions
- Audio of the entire session
- Task completion (success / partial / fail, using the criteria in the task table)
- Time on task (start when the task is read aloud, stop at completion or abandonment)
- Moderator notes (quotes, hesitations, errors, workarounds)
- Interview/debrief responses
- Survey responses

## Session Script
 
Read the scripted sections aloud as written so all participants receive the same instructions.
 
### 1. Welcome and Consent (read aloud)
 
> Welcome and thank you for participating in this usability study. This is not a test, it is to help me better understand human interactions with my application so I can improve it. You are free to stop at any time, so do not feel obligated to continue if you do not want to. You are not being tested or evaluated; I am only evaluating the application while you interact with it. First, I need to request your permission to conduct audio and visual recording of you and your screen. Do you consent?
 
*(If consent is not given, thank the participant and end the session. Do not record.)*

### 2. Demographics Questions

Ask verbally after consent, before setup. Read first: "You may decline to answer any of these questions."

>1. What is your age range? (18–24 / 25–34 / 35–49 / 50–64 / 65+ / prefer not to say)
>2. Do you garden, or have you gardened in the past? (regularly / occasionally / never / prefer not to say)
>3. How comfortable are you using websites and apps in general? (1–5 / prefer not to say)
>4. Have you ever used a gardening or plant-related app before? Which?
 
### 3. Setup (read aloud)
 
> Great, now I will ask you to share your screen with me. I will send you the link to the application we will be evaluating today. As you navigate throughout the application, I would like you to think out loud. Tell me everything that comes to your mind as you are using the website.

Share this link with user, inform of long loading time: [Link to GardenBook](https://gardenbook-tozv.onrender.com)

>I have shared the link with you and I can see your screen now, so once you have the application loaded we will get started.
 
### 4. First Impressions (read aloud)
 
> I see you have the application loaded. Take a minute to look at the page, and then I'd like you to tell me what you think the application is used for.
 
Record their answer verbatim before giving any explanation.
 
### 5. Context Statement (read aloud, after they answer)
 
> This is a website designed for gardeners. The site enables users to search for plants that thrive in their region and helps them build gardens based on the best time of year to plant each species in their region. When you navigate to the login screen, you will want to register and enter your ZIP code so the application can identify your region. As you use the application, please imagine you are a gardener planning what to plant this season.
 
### 6. Tasks
 
Read each task aloud, one at a time, in this order. Do not help unless the participant is completely stuck for more than ~2 minutes; if you must help, note it and mark the task "assisted." Remind participants to keep thinking out loud if they go quiet ("What are you thinking right now?").
 
| # | Task (read aloud) | Success criteria |
|---|---|---|
| 1 | "Create an account, using ZIP code of your choice." | Registered and logged in; lands on post-registration page |
| 2 | "Find out what plants you could plant in your garden this week." | Reaches Explore and correctly describes that the plants shown are plantable this week |
| 3 | "Find a plant you like and learn more about it — tell me when you could plant it." | Opens a plant's detail view and reads its planting window dates |
| 4 | "Create a garden for vegetables." | Garden of type vegetable exists |
| 5 | "Add a plant to the garden you just created." | Plant appears in the garden |
| 6 | "Find your planting calendar and tell me what is scheduled for this week." | Locates calendar view and reads the current week correctly |
| 7 | "Log out, then log back in." | Completes both; note where they land after login |
 
For each task, record: completion (success / assisted / fail), time on task, errors observed, and notable quotes.
 
### 7. Post-Study Survey
 
Given immediately after the last task, before the debrief conversation.
 
**Likert items** — Strongly Disagree | Disagree | Neutral | Agree | Strongly Agree:
 
1. The application was easy to use.
2. I understood what the application was for without needing an explanation.
3. I could find what I was looking for without getting lost.
4. The visual design helped me understand the application.
5. I would use an application like this if I gardened.

**Per-task ratings** — for each of the 7 tasks given above:
 
- Intuitiveness: Not Intuitive 1 2 3 4 5 Very Intuitive
- Effectiveness: Not Effective 1 2 3 4 5 Very Effective

**Overall ratings:**
 
- Overall intuitiveness: 1–5
- Overall effectiveness: 1–5

**Open response:** Do you have any suggestions for improving the application?
 
### 8. Debrief Questions (verbal, semi-structured)
 
1. What was your overall impression of the application?
2. What was the most confusing or frustrating moment, and what did you expect to happen instead?
3. What was the easiest part?
4. Was there anything you expected the application to do that it didn't?
5. Was there any wording, label, or image you found unclear?
6. If you could change one thing, what would it be?

### 9. Closing (read aloud)
 
> Thank you so much for your participation. If you don't have any other suggestions, I will stop the recording and you can leave the room now. Have a wonderful day!
 
## Analysis (after all six sessions)
 
Compile every observed issue into a shared findings list. 

For each issue record: description, which task(s) it appeared in, how many participants
hit it, severity, priority, and implementation status (was the fix implemented? how?).

**Post-session procedure:** 

Immediately after each session, write down
all notes from memory. Then rewatch the recording, looking for moments of frustration or
struggle, and add timestamped notes for each. Only after both passes are a participant's
notes considered complete.
 
**Severity rating (assign to each issue):**
 
| Rating | Meaning |
|---|---|
| 0 | Not a problem |
| 1 | Cosmetic |
| 2 | Minor usability issue |
| 3 | Major usability issue |
| 4 | Critical issue (blocks task completion) |
 
**MoSCoW prioritization (assign to each fix):**
 
- **Must** — fix before final submission
- **Should** — fix if time allows
- **Could** — nice to have
- **Won't** — out of scope for this project

Prioritize primarily by severity × number of participants affected.
 
## Moderator Consistency Rules
 
- Read scripted sections word for word; improvise only for clarifying logistics.
- Same task order for every participant.
- Never lead ("Try clicking Explore") — if stuck, ask "What would you try next?" first.
- Note-taking template and survey format identical across both moderators.
- Do not fix or explain bugs during the session; note them and move on.