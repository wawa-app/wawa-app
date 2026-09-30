WaWa

An alarm app you can't snooze your way out of. To turn the alarm off, you have to get up and photograph an object you registered beforehand. An AI vision check confirms it's the same object, and every successful morning grows your streak and levels up Uni, your virtual pet.

Capstone project, Langara College, Web and Mobile App Design and Development. Best in Show, Capstone Showcase (2026).

How it works

Register objects. Take a photo of something in another room, like a coffee mug or toothbrush. The app names it automatically with an AI vision model, and you can edit the name.
Set an alarm. Pick a time, repeat days and the object for that alarm's mission.
Complete the mission. When the alarm rings, photograph the same object. The app compares the new photo with the registered one and only stops the alarm on a match.
Grow Uni. Each successful mission adds 10 EXP and extends your streak. Uni evolves from Baby to Child, Teen, Adult and beyond every 5 levels. An emergency override stops the alarm but resets the streak.

AI object matching

WaWa calls the OpenAI Chat Completions API with image input (frontend/src/utils/vision.js):

compareImages sends the target and candidate photos and asks whether they show the same physical object. The prompt tells the model to treat parts hidden by a new angle, crop or lighting as unknown rather than as a difference, and to reject only on clear contradictions such as different text, logo, color or shape. The response is forced into JSON ({ "match": boolean, "reason": string }) and validated before use.
identifyObject returns a short generic name for a newly registered object, with a fallback to "Object" when the output is unclear or too long.

Tech stack

Mobile:	React Native 0.85, React Navigation, NativeWind, React Native Paper, Vision Camera, Lottie
Backend: Node.js, Express, JWT, bcrypt
Database: MongoDB Atlas, Mongoose (8 models)
AI:	OpenAI API (vision)
Email:	OTP emails for password reset
Deployment:	Render

Project structure

wawa-app/
├── frontend/   React Native app (screens, components, navigation, vision utils)
└── backend/    Express REST API
    └── src/
        ├── controllers/   auth, alarms, objects, missions, users
        ├── models/        User, Alarm, Object, MissionAttempt, MissionLog, Streak, Uni, SocialShare
        ├── routes/
        └── middleware/    JWT authentication
API overview

All routes except /api/auth require a JWT.

Route	Purpose
POST /api/auth/signup, /login, /forgot-password, /verify-otp, /reset-password	
Accounts and OTP password recovery
GET/POST/PUT/DELETE /api/alarms	
Alarm CRUD
GET/PATCH/DELETE /api/objects	
Registered objects
POST /api/mission/verify, /challenge-success, /challenge-failure	
Mission results, streak and EXP updates
PATCH /api/mission/emergency, /change-object, /streak-reset	
Overrides and mission changes
GET /api/users/stats, /history	
Streak, level and mission history


Running locally

Backend

bash
cd backend
npm install
cp .env.example .env   # fill in the values below
npm start              # http://localhost:3000
Variable	Description
PORT	Server port (default 3000)
MONGODB_URI	MongoDB Atlas connection string
JWT_SECRET	Secret for signing tokens

Mobile app (Node 22.11+)

bash
cd frontend
npm install
# add WAWA_OPENAI_API_KEY to frontend/.env
npm start
npm run android    # or: npm run ios

Team

Moonju (Bella) Ra — Full-Stack Lead Developer 
Rika Goto - Full-Stack Developer 
Carlos Martínez - Full-Stack Developer 
Gurpreet Singh - Full-Stack Developer 

License

MIT