const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Job = require('./models/jobs');

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/wf-roundsheets', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/jobs', async (req, res) => {
    const jobs = await Job.find({});
    res.render('jobs/index', { jobs })
});

app.get('/jobs/newjob', (req, res) => {
    res.render('jobs/newjob')
});

app.post('/jobs', async (req, res) => {
    const job = new Job(req.body.job);
    await job.save();
    res.redirect(`/jobs/${job._id}`)
});

app.get('/jobs/:id', async (req, res) => {
    const job = await Job.findById(req.params.id)
    res.render('jobs/details', { job })
});

app.get('/jobs/:id/edit', async (req, res) => {
    const job = await Job.findById(req.params.id)
    res.render('jobs/edit', { job })
});

app.put('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, { ...req.body.job })
    res.redirect(`/jobs/${job._id}`)
})

app.delete('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect('/jobs')
})


app.listen(3001, () => {
    console.log('Port 3001 is listening!')
})