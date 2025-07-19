# NoobStreamlineJS
Web development framework for modern web applications

Definition.js defines the app using a JSON definition. Elements can be defined easily and using navigation data can be configured to display data. You can define the back-end for StreamlineJS apps using any method available. Usually Noob Software has used PHP or NoobScript. And using an action handler to handle requests. You can define request's data in multiple ways in the element's ajax requests to match your back-end. But following a general pattern is recommended. And apply_load_mask is the function usually used to apply from get_data or navigation data to post data as can be seen when inspecting code in the element js files.

The basic structure of NoobStreamlineJS apps is to define pages and frames. Each page can have multiple frames. Frames can have default pages. The navigation class supports navigating frames and pages with get data which can be used to fetch data using the getpage_... function which calls and gets data from the backend. Elements can get data using the branch.root.post... function

examples of NoobStreamlineJS apps

http://thevault.hiphop
http://videogalaxy.net
