in this folder we can place all binary assets, that shouldn't be included in the git repo (because it takes too much space).
Instead, make a symbolic link! On my windows machine i did it like this:

mklink /J "C:\Users\Philipp\Projects\TechPrototype\assets" "C:\Users\Philipp\Dropbox\Peculiar Neighborhood\assets"

now in the project folder it is as if there was an "assets" folder.

note: remember the quotation marks in the path (windows needs it for paths with spaces)