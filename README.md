# fancytree_issue

Finally, made the electron webapp working with version fancytree v2.24.0, with a weird twist.  
To make it run, here is the procedure:

> npm run install_all
> npm run myapp

However, I was not able to make it work with standard npm install jquery.fancytree package installed in node_modules


Now to reproduce the problem, you can clone this branch and use the verison 
v2.26.0.  Use the following procedure to reproduce the problem:

> npm run clean

> npm install

> bower install

> npm run myapp

and you will notice the following exception:
   
* `Uncaught Error: Cannot find module 'jquery.fancytree.ui-deps'`


