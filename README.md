# Batch Github Issue Closer

We had an usual need.  1000s of issues we wanted to close on our issue
tracker.  So I wrote this code to do that.

`list.js` asks github for every issue that's open, has no assignee and no
milestone and generates `issue-list.ndjson` and `pr-list.ndjson` from that. 
These are newline delimited JSON files.

Each of `support-issues.js`, `unlabeled-issues.js`, `old-issues.js` read
`issue-list.ndjson` and print out issue ids of issues that meet our closing
criteria.

Finally, `close-issues.js` takes a label name and a message file, and reading a
list of ids from standard input closes each issue, labels it and adds a
comment with the contents of the message file.

Currently `close-issues.js` waits four seconds after labeling the issue,
four after adding a comment and four after closing the issue.  These delays
are necessary to avoid Github's undocumented abuse filters for actions that
trigger notifications.
