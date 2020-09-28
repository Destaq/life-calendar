<h1 align="center">Life Calendar</h1>
<p align="center">
    <a href="https://onlinelifecalendar.com" alt="Life Calendar website">
        <img src="https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fonlinelifecalendar.com%2Fapi%2Fusercount%2F" alt="number of users" /></a>
    <a href="#" alt="star">
         <img src="https://img.shields.io/github/stars/Destaq/life-calendar?style=for-the-badge" /></a>
    <a href="#" alt="Repo Size">
         <img src="https://img.shields.io/github/repo-size/Destaq/life-calendar?style=for-the-badge" /></a>
    <a href="#" alt="Languages">
        <img src="https://img.shields.io/github/languages/count/Destaq/life-calendar?style=for-the-badge" /></a>
</p>

With `life-calendar`, you can view your lifetime at a glance - seeing it anywhere from days to decades. These timeframes are represented by 'life boxes', which you can color-code, annotate, and edit with fancily or with Markdown to plan your goals or remember your achievements.

The goal of `life-calendar` is, and always has been, to serve as a means to help people grow more productive and utilize their time better. Our time here is limited, and we should make the most of it. This calendar acts as a life planner, journal, and accountability app all in one.

## Web App Overview
The best way to see what the web app can do is to go directly to the [site](https://onlinelifecalendar.com) but here's a visual overview for those who want to stay on GitHub.
<br>
<p align="center">
    <img src="/static/images/appdemo.gif" alt="gif demonstrating core functionality">
</p>

Essentially, these are the three pages that you'll be visiting the most often.
### The Life Calendar
This is where the real magic happens. You get an automatically generated list of paginated boxes which you can edit (images, tables, etc. all supported). You can likewise shade buttons and add their meanings to a legend.
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
- Shade life boxes to demonstrate specific events in your life
- Use Markdown or Fancy Mode to write down what and remember what happened or you want to accomplish
- Setand track colored, detailed goals for yourself
- Download or print your own life calendar
- View insightful statistics about your life

...and a lot more.


## Tutorial
You can click the image below to be directed to a YouTube video tutorial of the application, explaining core features and app usage.

[![Video Tutorial](/static/images/videopreview.png)](https://www.youtube.com/embed/8w8YWZGgqMs)

If you are more of a reader, there is already a *very* detailed tutorial [on the official site](https://onlinelifecalendar.com/tutorial/) which you are more than welcome to check out. It creating an account, basic and advanced features of Life Calendar, and all the other hidden goodies that haven't been mentioned here.

The website itself should be intuitive, but it's always helpful to have a tutorial around to reference. You can access individual parts of the site tutorial using the Table of Contents below.

- [Introduction](https://onlinelifecalendar.com/tutorial#introduction)
- [Getting Started](https://onlinelifecalendar.com/tutorial#getting-started)
    - [First Steps](https://onlinelifecalendar.com/tutorial#first-steps)
    - [Using the Site](https://onlinelifecalendar.com/tutorial#usage)
    - [Basic Features](https://onlinelifecalendar.com/tutorial#basic-features)
    - [Advanced Features](https://onlinelifecalendar.com/tutorial#advanced-features)
- [Other Pages](https://onlinelifecalendar.com/tutorial#other-pages)
   - [Statistics](https://onlinelifecalendar.com/tutorial#statistics)
   - [Goals](https://onlinelifecalendar.com/tutorial#goals-description)
   - [Download](https://onlinelifecalendar.com/tutorial#download)
- [Closing Notes](https://onlinelifecalendar.com/tutorial#closing-notes)

## Running Locally
It's super easy to get this app up and running on your local machine. While we recommend the [site](https://onlinelifecalendar.com) if you plan on using this long-term, it is beneficial to see how the app works locally, especially if you plan on forking or [contributing](#contributing).

Make sure that you have Python>=3.4 installed, as well as PostgreSQL (handy guide [here](https://www.postgresqltutorial.com/install-postgresql/).

First off, go ahead and either clone or fork the repo. You can easily clone it with the below command:
```bash
$ git clone https://github.com/Destaq/life-calendar.git
```

Next up, let's install all the requirements. There's quite a lot, so be prepared to wait for a minute or two!
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

So now it's time to run the application. All will work as it does on the [official website](https://onlinelifecalendar.com) except for sending emails and getting password verification, as those are managed by the Heroku host, not the code.

```bash
$ python3 manage.py db init
$ python3 manage.py db migrate
$ python3 manage.py db upgrade
$ python3 app.py
```

It will now be running on your localhost. You can go ahead and head over to [port 5000](http://localhost:5000) in your browser. 

## Contributing

Contributions are welcome! The JavaScript code is far from efficient, and more features to make Life Calendar better are wonderful.

An easy way to contribute is to fork the project, add some beautiful code, and then [open a pull request](https://www.github.com/Destaq/life-calendar/pulls). You'll be credited on the [contributions page](https://onlinelifecalendar.com/contribute/) with your name and GitHub profile link (and will get the warm fuzzy feeling of building a better free product for users).

## Donation

[Life Calendar](https://onlinelifecalendar.com) is free (cue background sounds of happiness). Problem is, server hosting, the PostgreSQL database, and domain name *aren't*. We live on donations, and you can help out by sponsoring the project here on GitHub or through PayPal.

If you head over to the top you press the heart button to sponsor the project or simply donate below through PayPal.

<center>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick" />
<input type="hidden" name="hosted_button_id" value="QAL9PWB9AZ8Z4" />
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_CZ/i/scr/pixel.gif" width="1" height="1" />
</form>
</center>

## Last Note

This project has been inspired by [this post](https://waitbutwhy.com/2014/05/life-weeks.html) on [waitbutwhy.com](http://www.waitbutwhy.com), which demonstrated a simple, printable calendar of an average life in weeks. Thanks for introducing the world to this, Tim Urban.

<hr>
<h2 id="todo">Todo</h2>
<p>Want to contribute but not sure where to start? Interested to see what the project's direction is? Search no further.</p>

<p>Once a task has been completed, it is removed from the below task list.</p>

- [ ] Multiple language support | **@medium @much-work**
- [ ] Build API for users to interact with | **@medium @much-work**
- [ ] Add ability to set Markdown/Fancy Mode preference in settings | **@low** **@maybe-not**
- [ ] Brainstorm alternative solution to `localStorage` dumping | **@low @much-work @future**
