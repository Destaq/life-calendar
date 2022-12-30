<h1 align="center">Life Calendar</h1>
<p align="center">
    <a href="https://onlinelifecalendar.herokuapp.com" alt="Life Calendar website">
         <img src="https://img.shields.io/github/stars/Destaq/life-calendar?style=for-the-badge" /></a>
    <a href="#" alt="Repo Size">
         <img src="https://img.shields.io/github/repo-size/Destaq/life-calendar?style=for-the-badge" /></a>
    <a href="#" alt="Languages">
        <img src="https://img.shields.io/github/languages/count/Destaq/life-calendar?style=for-the-badge" /></a>
</p>

With `life-calendar`, you can view your lifetime at a glance - seeing it anywhere from days to decades. These timeframes are represented by 'life boxes', which you can color-code, annotate, and edit with fancily or with Markdown to plan your goals or remember your achievements.

The goal of `life-calendar` is, and always has been, to serve as a means to help people grow more productive and utilize their time better. Our time here is limited, and we should make the most of it. This calendar acts as a life planner, journal, and accountability app all in one.

## Web App Overview
Due to [the removal of Heroku's free tier](https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq), there's no longer a hosted version of the site. As such, here's a visual overview for those who want to run things locally.
<br>
<p align="center">
    <img src="/static/images/appdemo.gif" alt="gif demonstrating core functionality">
</p>

Essentially, these are the three pages that you'll be visiting the most often.
### The Life Calendar
This is where the real magic happens. You get an automatically generated list of paginated boxes which you can edit (images, tables, etc. all supported). You can likewise color-code buttons and add their meanings to a legend.
<br>
<p align="center">
<img src="/static/images/homepage.png" width="65%" alt="homepage screenshot">
</p>

### The Statistics Page
You can look in awe at beautiful statistics provided to you about your usage of the app, such as words inputted or a life progress bar.
<br>
<p align="center">
<img src="/static/images/statistics.png" width="65%" alt="statistics demonstration">
</p>

### The Goals Page
This is the place to set customizable goals for yourself. Title, subtitle, and text are supported, as well as due dates + times and a colored outline.
<br>
<p align="center">
<img src="/static/images/goalexample.png" alt="sample goal">
</p>

## Features

- View your life in days, weeks, months, years, and decades
- Color-code life boxes to demonstrate specific events in your life
- Use Markdown or Fancy Mode to write down what and remember what happened or you want to accomplish
- Set and track colored, detailed goals for yourself
- Download or print your own life calendar
- View insightful statistics about your life

...and a lot more.


## Tutorial
You can click the image below to be directed to a YouTube video tutorial of the application, explaining core features and app usage.

[![Video Tutorial](/static/images/videopreview.png)](https://www.youtube.com/watch?v=8w8YWZGgqMs)

If you are more of a reader, there is already a *very* detailed tutorial [on my site](https://simonilincev.com/projects/life-calendar-tutorial) which you are more than welcome to check out. It creating an account, basic and advanced features of Life Calendar, and all the other hidden goodies that haven't been mentioned here.

You can access individual parts of the site tutorial using the Table of Contents below. Running locally will also generate a `/tutorial` page which has all of this information as well.

- [Introduction](https://simonilincev.com/projects/life-calendar-tutorial#introduction)
- [Getting Started](https://simonilincev.com/projects/life-calendar-tutorial#getting-started)
    - [First Steps](https://simonilincev.com/projects/life-calendar-tutorial#first-steps)
    - [Using the Site](https://simonilincev.com/projects/life-calendar-tutorial#usage)
    - [Basic Features](https://simonilincev.com/projects/life-calendar-tutorial#basic-features)
    - [Advanced Features](https://simonilincev.com/projects/life-calendar-tutorial#advanced-features)
- [Other Pages](https://simonilincev.com/projects/life-calendar-tutorial#other-pages)
   - [Statistics](https://simonilincev.com/projects/life-calendar-tutorial#statistics)
   - [Goals](https://simonilincev.com/projects/life-calendar-tutorial#goals-description)
   - [Download](https://simonilincev.com/projects/life-calendar-tutorial#download)
- [Closing Notes](https://simonilincev.com/projects/life-calendar-tutorial#closing-notes)

## Running Locally
It's super easy to get this app up and running on your local machine.

Make sure that you have Python>=3.4 installed, as well as PostgreSQL (handy guide [here](https://www.postgresqltutorial.com/install-postgresql/)).

First off, go ahead and either clone or fork the repo. You can easily clone it with the below command:
```bash
$ git clone https://github.com/Destaq/life-calendar.git
```

Now, we need to create out development environment. You can either do everything with `bash` and our handy `setup.sh` file, or do it manually for the explanations and a better understanding.

### Automatic Method: Shell Command
If you'd like us to handle all the pesky requirements installations and database creation, simply navigate to the folder where `life-calendar` was installed.
```bash
cd life-calendar
```

**Before you run the script, make sure you have [PostgreSQL](https://www.postgresqltutorial.com/install-postgresql/) and [Python](https://www.python.org/downloads/) installed!**

Alright now that we've got that out of the way you can run the following in your terminal (make sure you're in the `life-calendar` directory):
```bash
source setup.sh
```

*The `source` part is very important! If it doesn't work, you can try `. setup.sh`.*

After a couple minutes you should have all dependencies installed and the database created. You can then simply run `python3 app.py` to start the development server.

*Note: you may receive red text when `psycopg2`. This is expected for Mac/Linux users, and another requirement, `psycopg2-binary`, takes care of this for you.*

### Manual Method: Multiple Commands
If you'd like to install and setup everything manually, it's outlined below.

First we need to install all the requirements. There's quite a lot, so be prepared to wait for a minute or two!
```bash
$ cd life-calendar
$ python3 -m pip install -r requirements.txt
```

Nearly there! We just need to set some environment variables and get our PostgreSQL database running. We can create a PostgreSQL database with `createdb life_calendar` (you can name this whatever you want, as long as you haven't used it before).

Now onto the environment variables - we are going to need to set four. The below commands work for Linux and Mac. If you're a Windows user, refer to [this](https://www.schrodinger.com/kb/1842) guide to setting environment variables.
```bash
export APP_CONFIG_KEY="super-secret"
export DATABASE_URL="postgresql://localhost/life_calendar"
```

We also need to export the keys for SendGrid emailing. You can set these to whatever you want; the program won't run without them but unless you're working on the contact page or forgot password page you should be fine.

```bash
export JWT_EMAIL_ENCODE_KEY="super-random"
export SENDGRID_API_KEY="not-important"
```

You can verify that these are set with `echo $APP_CONFIG_KEY` and `echo $DATABASE_URL`, if they don't show up you can just try setting them again.

Of course, if you didn't name your database `life_calendar`, you're going to have to change the database URL.

Finally, make sure to comment out line 73 of `init.py` (the Talisman wrapper)! Talisman forces serving over HTTPS, but since localhost is insecure, this will cause an error! You'll need to disable it for the app to run properly in localhost, otherwise you'll get an `HTTPStatus.BAD_REQUEST`.

So now it's time to run the application. All will work as it used to on the hosted website except for sending emails and getting password verification, as those are managed by the Heroku host, not the code.

```bash
rm -r migrations
$ python3 manage.py db init
$ python3 manage.py db migrate
$ python3 manage.py db upgrade
$ python3 app.py
```

It will now be running on your localhost. You can go ahead and head over to [port 5000](http://localhost:5000) in your browser. 

## Contributing

Contributions are welcome! The JavaScript code is far from efficient, and more features to make Life Calendar better are wonderful.

An easy way to contribute is to fork the project, add some beautiful code, and then [open a pull request](https://www.github.com/Destaq/life-calendar/pulls). You'll be credited on the [contributions page](https://onlinelifecalendar.com/contribute/) with your name and GitHub profile link (and will get the warm fuzzy feeling of building a better free product for users).

## Last Note

This project has been inspired by [this post](https://waitbutwhy.com/2014/05/life-weeks.html) on [waitbutwhy.com](http://www.waitbutwhy.com), which demonstrated a simple, printable calendar of an average life in weeks. Thanks for introducing the world to this, Tim Urban.

<hr>
<h2 id="todo">Todo</h2>
<p>Want to contribute but not sure where to start? Interested to see what the project's direction is? Search no further.</p>

<p>Once a task has been completed, it is removed from the below task list.</p>

- [ ] Multiple language support | **@medium**
- [ ] Build API for users to interact with | **@medium @much-work**
- [ ] Email reminders for goals *(and site pop-up reminders)* | **@easy @under-consideration**
- [ ] Add ability to set Markdown/Fancy Mode preference in settings | **@low** **@maybe-not**
- [ ] Goals duedate integration with calendar page | **@low**
- [ ] Brainstorm alternative solution to `localStorage` dumping | **@low @much-work @future**

<h2 id="known-issues">Known Issues</h2>
<p>Below are issues that have been reported by users, but were not previously discovered in testing. Please consider using alternate browsers to get around the respective bugs.</p>

<ul>
    <li>Edge Browser completely unsupported.</li>
    <li>Color-coding boxes does not work on Firefox 81.</li>
</ul>
