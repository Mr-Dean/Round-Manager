const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const asyncCatch = require('./utils/asyncCatch');
const { jobSchema } = require('./schemas');
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

const validateJob = (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/jobs', asyncCatch(async (req, res) => {
    const jobs = await Job.find({});
    res.render('jobs/index', { jobs })
}));

app.get('/jobs/newjob', (req, res) => {
    res.render('jobs/newjob')
});

app.post('/jobs', validateJob, asyncCatch(async (req, res) => {
    const job = new Job(req.body.job);
    await job.save();
    res.redirect(`/jobs/${job._id}`)
}));

app.get('/jobs/:id', asyncCatch(async (req, res) => {
    const job = await Job.findById(req.params.id)
    res.render('jobs/details', { job })
}));

app.get('/jobs/:id/edit', asyncCatch(async (req, res) => {
    const job = await Job.findById(req.params.id)
    res.render('jobs/edit', { job })
}));

app.put('/jobs/:id', validateJob, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, { ...req.body.job })
    res.redirect(`/jobs/${job._id}`)
}));

app.delete('/jobs/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect('/jobs')
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh no...something went wrong!";
    res.status(statusCode).render('error', { err })
});


app.listen(3001, () => {
    console.log('Port 3001 is listening!')
})