import express from 'express'
import './config.mjs';
import './db.mjs';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to the database");
});

const User = mongoose.model("User")
const Class = mongoose.model("Class")
const Note = mongoose.model("Note")

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.json());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'dist/client')));

app.use(cors({
    origin: 'https://notie-gamma.vercel.app',
    credentials: true,
}));

app.post('/api/register', async (req, res) => {
    try{
        const {username, password} = req.body;
        let user = await User.findOne({username});
        if (user){
            return res.status(400).json({error: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({username, password: hashedPassword});
        const personal_notes = new Class({user: user, className: "Personal Notes"});
        user.classes.push(personal_notes);
        await personal_notes.save();
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    }
    catch (error){
        res.status(500).json(error);
    }
});

app.post('/api/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username})
        if (!user){
            return res.status(400).json({ error: "Invalid username or password" });
        }
        if (await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            res.status(201).json({ token });
        }
        else{
            res.status(400).json({error: "Invalid username or password"});
        }
    }
    catch (error){s
        res.status(500).json({error: error});
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};


app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json('User logged out successfully');
})

app.get('/api', verifyToken, async (req, res) => {
    const currUser = await User.findById(req.session.userId);
    const classData = await Class.find({user: currUser._id})
    return res.json(classData)
})

app.get('/api/classes/:classID', verifyToken, async (req, res) => {
    const classID = req.params.classID;
    const currClass = await Class.findById(classID).populate('notes', 'title');
    return res.json(currClass);
});

app.get('/api/classNotes/:noteID', verifyToken, async (req, res) => {
    const noteID = req.params.noteID;
    const currNote = await Note.findById(noteID);
    return res.json(currNote);
});

app.post('/api/createClass', verifyToken, async (req, res) => {
    const {className} = req.body;

    const currUser = await User.findById(req.session.userId);
    const newClass = new Class({user: currUser, className: className});
    currUser.classes.push(newClass);

    await currUser.save();
    await newClass.save();
    return res.json(newClass);
});

app.post('/api/createNote', verifyToken, async (req, res) => {
    const {noteName, noteContent, classID} = req.body;

    const currUser = await User.findById(req.session.userId);
    const currClass = await Class.findOne({user: currUser, _id: classID});
    const newNote = new Note({user: currUser, title: noteName, content: noteContent});
    currClass.notes.push(newNote);

    await currClass.save();
    await newNote.save();
    return res.json(newNote);
});

app.post('/api/deleteClass/:classID', verifyToken, async (req, res) => {
    try{
        const classToRemove = await Class.findById(req.params.classID);

        const currUser = await User.findById(req.session.userId);
        currUser.classes = currUser.classes.filter(classItem => classItem._id !== classToRemove._id);
        await currUser.save();


        const currNotes = await Note.find({class: classToRemove._id});
        currNotes.forEach(async note => {
            await note.deleteOne();
        });
        await Class.deleteOne({ _id: classToRemove._id })
        return res.json('Class deleted successfully');
    } catch (error) {
        return res.status(500).json('Error deleting class');
    
    }
})

app.post('/api/deleteNote/:noteID', verifyToken, async (req, res) => {
    try {
        const { noteID } = req.params;
        const currNote = await Note.findById(noteID);

        if (!currNote) {
            return res.status(404).json('Note not found');
        }

        const currClass = await Class.findOne({ notes: currNote._id });

        if (currClass) {
            currClass.notes = currClass.notes.filter(note => note.toString() !== currNote._id.toString());
            await currClass.save();
        }

        await currNote.deleteOne();
        return res.json('Note deleted successfully');
    } catch (error) {
        return res.status(500).json('Error deleting note');
    }
});

app.listen((process.env.PORT || 3000) , () => {
    console.log("Server is running on port", process.env.PORT || 3000);
});
