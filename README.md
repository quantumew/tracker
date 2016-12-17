Tracker
=======

[![Build Status](https://travis-ci.org/quantumew/tracker.svg?branch=master)](https://travis-ci.org/quantumew/tracker)
[![codecov.io](https://codecov.io/github/quantumew/tracker/coverage.svg?branch=master)](https://codecov.io/github/quantumew/tracker?branch=master)


Time tracking utility.

Currently under development!

Usage
-----

    tk use <timesheet> [options]
    tk in <tag> [--description=<desc>] [--at=<time>] [options]
    tk out [--at=<time>] [options]
    tk analyze [--tag <tag>] [--today] [--yesterday] [--from <date>] [--to <date>] [options]
    tk edit <id> [--in=<time>] [--out=<time>] [options]

options:
    --verbose, -v            Turn on debug logging.

    --help, -h, -?           Shows this help message.

    <id>                      Id of entry to edit.

    <timesheet>               Timesheet to use.

    <tag>                     Tag for entry in timesheet.

    -a, --at <time>           Time to clock in/out.

    -t, --today               Analyze all timesheets for the day.

    -y, --yesterday           Analyze timesheets for previous day.

    -d, --description <desc>  Description of timesheet clock in entry. [default: ""]

    -t <date>, --to <date>    Date to analyze to.

    -f <date>, --from <date>  Date to analyze from.

    --in <time>               Edit clock in time.

    --out <time>              Edit clock out time.


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


    # You can also filter by tags!
    tk analyze --tag tracker

    Timesheet Analytics
    ---------------------------------------------------------------------------------------
    Day                          Clock In     Clock Out    Duration  Tag        Description
    ---------------------------  -----------  -----------  --------  ---------  -----------
    Saturday, December 10, 2016  22:03:12 pm  23:02:34 pm  0:59      tracker    Making a hacky time tracking utility
    Sunday, December 11, 2016    12:50:21 pm  12:59:53 pm  0:09      tracker    doing more tracker stuuuf

    Total: 1:08


    # Or analyze the entire day. There is also a -y, --yesterday shortcut option!
    tk analyze --today

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


    # Or analyze a range of time. This will print from the 11th to today.
    tk analyze --from 12-11-16

    # Analyze particular range.
    tk analyze --from 12-11-16 --to 12-13-16


Edit
----
Currently unimplemented.
