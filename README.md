Tracker
=======

[![Build Status](https://travis-ci.org/quantumew/tracker.png)](https://travis-ci.org/quantumew/tracker.svg?branch=master)
[![codecov.io](https://codecov.io/github/quantumew/tracker/coverage.svg?branch=master)](https://codecov.io/github/quantumew/tracker?branch=master)


Time tracking utility.

Currently under development!

Usage
-----

    tk use <timesheet> [options]
    tk in <tag> [--description <desc>] [options]
    tk out [options]
    tk analyze [options]
    tk edit [options]

    Generic Options:
        --verbose, -v            Turn on debug logging.

        --help, -h, -?           Shows this help message.

    Action Specific Options:
        <timesheet>              Timesheet to use.

        <tag>                    Tag for entry in timesheet.

        --all                    List all timesheets for the day.

        -d, --description <desc> Description of timesheet clock in entry.


Timesheets
----------
To start using tracker you must first understand the basics. It works with timesheets and entries within the timesheets. For instance, let's say I have 3 major topics of work. Coding, code review, and meetings. I would split those into timesheets. Here is how that would work.

    # Your day starts and you start with a meeting.
    tk use meeting

    # Now clock into an entry. Lets say the meeting is the daily stand up meeting.
    tk in stand-up

    # Now let's say you are going to start coding. If you are logging into a
    # new timesheet or entry there is no need to clock out of the previous
    # that will occur automatically.
    tk use code

    tk in tracker --description "Making a hacky time tracking utility"

    # We can manually clock out.
    tk out

Analyze
-------
This feature is still a work in progress but the goal is to be an easy interface for grabbing data based on timesheets, tags, and dates.


    # We are currently logged into our code timesheet.
    tk analyze


    Timesheet Analytics
    ---------------------------------------------------------------------------------------
    Day                          Clock In     Clock Out    Duration  Tag        Description
    ---------------------------  -----------  -----------  --------  ---------  -----------
    Saturday, December 10, 2016  22:03:12 pm  23:02:34 pm  0:59      tracker    Making a hacky time tracking utility
    Sunday, December 11, 2016    12:50:21 pm  12:59:53 pm  0:09      tracker    doing more tracker stuuuf
    Sunday, December 11, 2016    13:10:32 pm               1:01      work       Work work work work!

    Total: 2:10


    # Or analyze the entire day.
    tk analyze --all

    Timesheet Analytics
    -------------------------------------------------------------------------------------------------------
    timesheet    Day                          Clock In     Clock Out    Duration  Tag        Description
    -----------  ---------------------------  -----------  -----------  --------  ---------  --------------
    code-review
                 Thursday, December 15, 2016  20:17:19 pm  20:19:07 pm  0:01      DDQ        PR #7
                 Thursday, December 15, 2016  21:22:54 pm  22:05:34 pm  0:42      OpenToken  PR #106
    code
                 Thursday, December 15, 2016  22:03:12 pm  23:02:34 pm  0:59      DDQ
                 Thursday, December 15, 2016  12:50:21 pm  12:59:53 pm  0:09      Tracker    Tracker stuff.
                 Thursday, December 15, 2016  13:10:32 pm  14:36:22 pm  1:25      work
                 Thursday, December 15, 2016  14:36:22 pm  20:09:02 pm  5:32      other      something new!
                 Thursday, December 15, 2016  20:09:02 pm  20:18:57 pm  0:09      work
    meeting
                 Thursday, December 15, 2016  20:19:24 pm  21:00:22 pm  0:40      standup    daily meeting.

    Total: 9:42


Edit
----
Currently unimplemented.
