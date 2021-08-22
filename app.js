const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const asyncCatch = require('./utils/asyncCatch');
const { jobSchema } = require('./schemas');
const { operativeSchema } = require('./schemas');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Job = require('./models/jobs');
const Operative = require('./models/operative');
const Round = require('./models/rounds');

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

const validateOperative = (req, res, next) => {
    const { error } = operativeSchema.validate(req.body);
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

// OPERATIVE ROUTES //

app.get('/operatives', asyncCatch(async (req, res) => {
    const operatives = await Operative.find({});
    res.render('operatives/index', { operatives });
}));

app.get('/operatives/new', (req, res) => {
    res.render('operatives/new')
});

app.get('/operatives/:id', async(req, res) => {
    const operative = await Operative.findById(req.params.id);
    res.render('operatives/details', { operative })
})

app.post('/operatives', validateOperative, asyncCatch(async (req, res) => {
    const operative = new Operative(req.body.operative);
    await operative.save();
    res.redirect(`/operatives`)
}));

app.put('/operatives/:id', validateOperative, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const operative = await Operative.findByIdAndUpdate(id, { ...req.body.operative })
    res.redirect(`/operatives/${operative._id}`)
}));

app.delete('/operatives/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Operative.findByIdAndDelete(id);
    res.redirect('/operatives')
}));


// ROUND ROUTES //

//NEED TO ADD ERROR HANDLING!

app.get('/rounds', async(req,res) => {
    const rounds = await Round.find({})
    res.render('rounds', { rounds });
})



app.get('/rounds/new', async(req, res) => {
    const { number } = req.query;
    const { employee } = req.query;
    const operative = await Operative.find({ name: employee });
    const round = await Job.find({ roundNumber: number });
    

res.render('rounds/new', { round, operative })
});

app.post('/rounds', async(req, res) => {
    let operative = req.body.round.operative;
    //Get the data from each row
    let _id = req.body.round._id;
    let roundNumber = req.body.round.roundNumber;
    let ref = req.body.round.ref; 
    let name = req.body.round.name;
    let address = req.body.round.address;
    let freq = req.body.round.freq;
    let accManager = req.body.round.accManager;
    let details = req.body.round.details;
    let exterior = req.body.round.exterior;
    let interior = req.body.round.interior;

   
    
    

// Create the object array for each table row
    let jobs =ref.map((ref, i) => {
        return {
        _id: _id[i],
        roundNumber: roundNumber[i],
        ref: ref,
        name: name[i],
        address: address[i],
        freq: freq[i],
        accManager: accManager[i],
        details: details[i],
        exterior: exterior[i],
        interior: interior[i], 
  }
});
console.log(jobs)

// need to add function to prevent duplicating operative rounds!
    
    const round = new Round({operative: operative, jobs: jobs});
    await round.save();
    res.redirect('/rounds') 
});

app.get('/rounds/:id', async(req, res) => {
    const round = await Round.findById(req.params.id);
    res.render('rounds/show', { round })
})


app.delete('/rounds/:id', asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Round.findByIdAndDelete(id);
    res.redirect('/rounds')
}));

//create view for rounds

//create edit for rounds

//create delete for rounds


//need to link operative and round to create assigned round schema


// TEST JOBS
app.get('/test', (req, res) => {
    res.render('rounds/jobform')
})


// JOB ROUTES //

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