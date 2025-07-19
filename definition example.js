app.definition = {
	"routes": { 
		"everyone": {
			"default_route": "0:index:;2:about:;3:collections:id=32;4:mainmenu:;5:player:id=-1&albums_id=-1;7:playlist:;", //
			"allowed_routes": {
				0: "index",
				2: "*",
				3: "*",
				4: "mainmenu",
				5: "player",
				7: "playlist"
			},
			"default_sub_routes": { //ef navigatad er til sidu loada sub route
				"page": ""
			}
		},

	},
	"auto_generate_tags": [
		"persons",
		"collections"
	],
	"pages": [
		{
			"id": "index",
			"template": ".index_container",
			"content": [
				/*{
					"type": "menu",
					"content": "fetch",
					"target_frame": "frame0"
				},*/
				/*{
					"type": "search",
					"id": "mainsearch",
					"template_target_selector": ".search_container"
				},*/ 
				//framkvæma leit thannig ad thad leiti i gegnum allar sidur loadi oll gogn ur elementum og birti relevant sidur
				//loada oll gogn med elementi og nota pagination
				{
					"type": "frame",
					"id": 2,
					"default_page": "about",
					"template_target_selector": ".frame2_container",
				},
				{
					"type": "frame",
					"id": 3,
					"default_page": "collections",
					"template_target_selector": ".frame3_container",
				},
				{
					"type": "frame",
					"id": 4,
					"default_page": "mainmenu",
					"template_target_selector": ".frame4_container",
				},
				{
					"type": "frame",
					"id": 5,
					"default_page": "player",
					"template_target_selector": ".frame5_content",
				},
				/*{
					"type": "frame",
					"id": 6,
					"default_page": "related",
					"template_target_selector": ".frame6_content",
				},*/
				{
					"type": "frame",
					"id": 7,
					"default_page": "playlist",
					"template_target_selector": ".frame7_container",
				},
				{
					"type": "search",
					"id": "mainsearch",
					"template_target_selector": ".search_container",
					"target_href": "search_results",
					"target_frame": 2
				}
				/*{
					"type": "frame", //global overlays frame
					"id": 1,
					"global_overlays_frame": true,
					//"default_page": "introduction"
				}*/
			]
		},
		{
			"id": "playlist",
			"user_access": "everyone",
			"prevent_reload": true,
			"content": [
				{
					"type": "tracklist",
					"id": "playlist",
					"content": null,
					"player_target_frame": 5
					/*"album_link": */
				}
				/*{
					"id": "related",
					"type": "tags",
					"post_data": {

					}
				}*/
			]
		},
		{
			"id": "related",
			"user_access": "user",
			"content": [
				/*{
					"id": "related",
					"type": "tags",
					"post_data": {

					}
				}*/
			]
		},
		{
			"id": "playlistview",
			"user_access": "everyone",
			"get_data": {
				"item": "playlisttracks"
			},
			"content": [
				{
					"type": "table",
					"id": "playlisttracks",
					"item": "playlisttracks",
					//"cache": (24*60*5),
					//"show_actions": true,
					//"edit": "Open and edit",
					/*"on_load": [
						"appitem_form"
					],*/
					"post_data": {
						"playlists_id": "id"
					},
					"columns": [
						{
							"id": "title",
							"type": "text",
							"title": "title"
						},
						{
							"id": "collection",
							"type": "text",
							"title": "collection"
						},
						{
							"id": "album",
							"type": "text",
							"title": "album"
						},
						{
							"id": "year",
							"type": "text",
							"title": "year"
						},
						/*{
							"id": "description",
							"type": "text",
							"title": "Description",
							"editable": true
						},
						{
							"id": "downloads_ids",
							"type": "text",
							"title": "download ids"
						},*/
						/*{
							"id": "edit",
							"type": "edit_button",
							"title": "Open and edit",
							"value": "Open and edit"
						}*/
					],
					/*"on_double_click": {
						"target_page": "player",
						"target_frame": 5
					}*/
					"on_double_click": {
						"external_href": "youtubelink"
					}
				},
				{
					"title": "Add track",
					"type": "form",
					"id": "playlisttracks",
					"item": "playlisttracks",
					"new_on_save": true,
					/*"post_data": {
						"collections_id": "id"
					},*/
					/*"post_data": {
						"playlists_id": "id"
					},*/
					"save": true,
					"new": true,
					"content": [
						/*{
							"type": "text",
							"id": "title",
							"placeholder": "Request title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Request description",
						},
						{
							"type": "number",
							"id": "year",
							"placeholder": "Request item year",
						},
						{
							"type": "typeahead",
							"id": "collections",
							"item": "collections",
							"placeholder": "Collection name"
						},*/
						{
							"type": "typeahead",
							"id": "tracks",
							"item": "tracks",
							"placeholder": "Track name",
							"optional_field": true
						},
						{
							"type": "hidden",
							"id": "playlists_id",
							"persist_value": true
						}
					],
					"get_load_mask": {
						"playlists_id": "id"
					},
					"on_submit": [
						"playlisttracks_table",
					],
					"on_load": [
					],
					"dependency": {
						"linked_item": "can_edit",
						"value": "set",
						"type": "hide"
					},
				},
			]
		},
		{
			"id": "playlists",
			"user_access": "everyone",
			"get_data": {
				"item": "playlists"
			},
			"content": [
				{
					"type": "grid",
					"id": "playlists",
					"item": "playlists",
					/*"post_data": {
						"search_term": "search_term"
					},*/
					"image_location": "playlists_images",
					"click": "playlistview",
					"target": "playlists_form",
					"target_frame": 3
				},
				{
					"title": "Add playlist",
					"type": "form",
					"id": "playlists",
					"item": "playlists",
					/*"post_data": {
						"collections_id": "id"
					},*/
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Collection title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Collection description",
						},
						/*{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						}*/
					],
					/*"get_load_mask": {
						"collections_id": "id"
					},*/
					"on_submit": [
						"playlists_grid",
						"playlistsimage_fileupload"
					],
					"on_load": [
						"playlistsimage_fileupload"
					],
					"dependency": {
						"linked_item": "can_edit",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"id": "playlistsimage",
					"type": "fileupload",
					"form_action": "upload.php?action=playlists_image",
					"submit_mask": {
						//"connect_value": "'character'",
						"playlists_id": "playlists_form.id",	
					},
					"dependency": {
						"linked_item": "playlists_form.id",
						"value": "set",
						"type": "hide"
					},
					"on_submit": [
						"playlists_grid"
					]
				},
			]
		},
		{
			"id": "all_tracks",
			"user_access": "everyone",
			"content": [
				{
					"type": "table",
					"id": "tracks",
					"item": "tracks",
					//"cache": (24*60*5),
					//"show_actions": true,
					//"edit": "Open and edit",
					/*"on_load": [
						"appitem_form"
					],*/
					"columns": [
						{
							"id": "title",
							"type": "text",
							"title": "title"
						},
						{
							"id": "collection",
							"type": "text",
							"title": "collection"
						},
						{
							"id": "album",
							"type": "text",
							"title": "album"
						},
						{
							"id": "year",
							"type": "text",
							"title": "year"
						},
						/*{
							"id": "description",
							"type": "text",
							"title": "Description",
							"editable": true
						},
						{
							"id": "downloads_ids",
							"type": "text",
							"title": "download ids"
						},*/
						/*{
							"id": "edit",
							"type": "edit_button",
							"title": "Open and edit",
							"value": "Open and edit"
						}*/
					],
					/*"on_double_click": {
						"target_page": "player",
						"target_frame": 5
					}*/
					"on_double_click": {
						"external_href": "youtubelink"
					}
				},
				/*{
					"type": "link",
					"id": "play_button",
					"content": "Play Tracks",
					"target_href": "player",
					"target_frame": 5,
					"post_data": {
						"albums_id": "'0'",
						"id": "'0'"
					},
					"template_target_selector": ".play_button_container"
				},*/
				/*{
					"id": "related",
					"type": "tags",
					"post_data": {

					}
				}*/
			]
		},
		{
			"id": "history",
			"user_access": "everyone", //"user_access": "everyone",
			"content": [
				{
					"id": "title",
					"type": "content",
					"content": "User Download History"
				},
				/*{
					"type": "grid",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"search_term": "search_term"
					},
					"image_location": "images",
					"click": "collections",
					"target": "collections_form",
					"target_frame": 3
				},*/
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "tracks",
					"post_data": {
						"user_id": "self.user_id"
					},
					"album_link": true
				},
			]
		},
		{
			"id": "search_results",
			"user_access": "everyone", //"user_access": "everyone",
			"content": [
				{
					"id": "title",
					"type": "content",
					"content": "Search Results"
				},
				{
					"type": "grid",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"search_term": "search_term"
					},
					"image_location": "images",
					"click": "collections",
					"target": "collections_form",
					"target_frame": 3
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "tracks",
					"post_data": {
						"search_term": "search_term"
					},
					"album_link": true
				},
			]
		},
		{
			"id": "requests",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "requests"
			},
			"content": [
				{
					"type": "content",
					"id": "title",
					"content": "Requests"
				},
				{
					"title": "Submit request",
					"type": "form",
					"id": "requests",
					"item": "requests",
					/*"post_data": {
						"collections_id": "id"
					},*/
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Request title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Request description",
						},
						{
							"type": "number",
							"id": "year",
							"placeholder": "Request item year",
						},
						{
							"type": "typeahead",
							"id": "collections",
							"item": "collections",
							"placeholder": "Collection name"
						},
						{
							"type": "typeahead",
							"id": "persons",
							"item": "persons",
							"placeholder": "Main artist name",
							"optional_field": true
						}
						/*{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						}*/
					],
					"get_load_mask": {
					},
					"on_submit": [
						"requests_requests",
					],
					"on_load": [
					],
					"dependency": {
						"linked_item": "can_edit",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"id": "requests",
					"type": "requests",
					"item": "requests", //hengja vid collections eda artist
					"post_data": {

					},
					"target_frame": 3,
				},
			]
		},
		{
			"id": "disclaimer",
			"user_access": "everyone",
			"content": [
				{
					"id": "disclaimermain",
					"type": "content",
					"content": "This website is non-profit and the information shared here is for historical and educational purposes and is fair use. The copyright owners are aware that their music is uploaded to YouTube and allow their music there."
				}
			]
		},
		{
			"id": "mainmenu",
			"user_access": "everyone", //"user_access": "everyone",
			/*"get_data": {
				"item": "appitem"
			},
			"animation": [
				{
					"from_page": "mainmenu",
					"type": "slide_in"
				}
			],*/
			"content": [
				{
					"type": "menu",
					"id": "mainleftsub",
					"target_frame": 3,
					/*"dependency": {
						"linked_item": "started",
						"type": "disabled",
						"value": "set"
					},*/
					"content": [
						{
							"content": "Collections",
							"target_href": "collections",
							"post_data": {
								"id": "'32'"
							}
						},
						{
							"content": "Recently Added",
							"target_href": "recently_added"
						},
						/*{
							"content": "Playlists",
							"target_href": "playlists"
						},*/
						/*{
							"content": "Top Downloads",
							"target_href": "top_downloads"
						},*/
						{
							"content": "All Tracks",
							"target_href": "all_tracks"
						},
						{
							"content": "Disclaimer",
							"target_href": "disclaimer"
						},
						{
							"content": "Blog",
							"target_href": "blog"
						},
						{
							"content": "Noob Music",
							"url_link": "https://noob.software/#noobmusic_main"
						}, /*recently_added_alt*/
						{
							"content": "Recently Modified",
							"target_href": "recently_added_alt"
						},
						/*{
							"content": "Forum",
							"target_href": "forum"
						},*/
						/*{
							"content": "Requests",
							"target_href": "requests"
						},
						{
							"content": "Submit Content",
							"target_href": "submitcontent"
						},
						/*{
							"content": "Download History",
							"target_href": "history"
						}*///
						
						/*{
							"content": "Artists",
							"target_href": "artists",
						},*/
						/*{
							"content": "Interface Design",
							"target_href": "interface_design",
							"post_data": {
								"id": "id"
							}
							"children": [

							]
						},*/
					]
				},
				/*{
					"type": "globe",
					"id": "globevisits"
				}*/
			]
		},
		{
			"id": "post",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "posts"
			},
			"content": [
				{
					"id": "title",
					"type": "content"
				},
				{
					"type": "editablecontent",
					"id": "posts",
					"item": "posts",
					"post_data": {
						"posts_id": "id",
						"item": "'posts'"
					},
					"colors": [
						"rgba(0,0,0,0.67)",
						"rgba(255,255,255,0.67)",
						"rgba(20, 255, 255, 0.5)",
						"rgba(255, 20, 20, 0.5)",
						"rgba(255, 206, 105, 0.5)"
					],
					"text_colors": [
						"rgba(255,255,255,0.96)",
						"rgba(0,0,0,0.96)",
					]
				},
			]
		},
		{
			"id": "blog",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "posts"
			},
			"no_php_get": true,
			"content": [
				{
					"type": "bloglist",
					"id": "blog",
					"item": "posts",
					"page_id": "post",
					"target_frame": 3,
					"post_data": {},
					"target": "posts_form",
				},
				{
					"title": "Add blog post",
					"type": "form",
					"id": "posts",
					"item": "posts",
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Blog post title",
						},
					],
					"on_submit": [
						"blog_bloglist"
					],
					"on_load": [
						
					],
					"dependency": [
						{
							"linked_item": "can_edit",
							"value": "set",
							"type": "hide"
						},
					]
				},
			]
		},
		{
			"id": "artists",
			"user_access": "everyone", //"user_access": "everyone",
			"content": [
				{
					"type": "grid",
					"id": "artists",
					"item": "artists",
					/*"post_data": {
						"collections_id": "id"
					},*/
					"image_location": "artists_images",
					//"title_as_image": true,
					"click": "collections",
					"target": "collections_form",
					//"if_can_edit_only": true,
					"dependency": {
						"linked_item": "has_collections",
						"value": "set",
						"type": "hide"
					},
					//"template_target_selector": ".apps_container_main",
				},
				{
					"title": "Add artist",
					"type": "form",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"collections_id": "id"
					},
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Collection title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Collection description",
						},
						{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						}
					],
					"get_load_mask": {
						"collections_id": "id"
					},
					"on_submit": [
						"collections_grid",
						"collectionsimage_fileupload"
					],
					"on_load": [
						"collectionsimage_fileupload"
					],
					"dependency": {
						"linked_item": "can_edit",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"id": "collectionsimage",
					"type": "fileupload",
					"form_action": "upload.php?action=collections_image",
					"submit_mask": {
						//"connect_value": "'character'",
						"collections_id": "collections_form.id",	
					},
					"dependency": {
						"linked_item": "collections_form.id",
						"value": "set",
						"type": "hide"
					},
					"on_submit": [
						"collections_grid"
					]
				},
			]
		},
		{
			"id": "player",
			"user_access": "everyone", //"user_access": "everyone",
			"prevent_reload": true,
			//"prevent_hard_reload": true,
			"content": [
				{
					"id": "main",
					"type": "mediaplayer",
					"self_page": "player",
					"post_data": {
						"id": "id",
						"albums_id": "albums_id"
					},
					"item": "tracks",
					"playlist_target_frame": 7,
					"large_playlist_target_frame": 3
				}
				/*{
					"type": "content",
					"id": "test",
					"content": "test123"
				}*/
			]
		},
		{
			"id": "submitcontent",
			"user_access": "user",
			"content": [
				{
					"type": "content",
					"id": "instructions",
					"content": "Fill in information, upload field appears below after you save the item, there you can upload one or more files."
				},
				{
					"title": "Submit Content",
					"type": "form",
					"id": "contents",
					"item": "contents",
					/*"post_data": {
						"collections_id": "id"
					},*/
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Content title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Content description",
						},
						{
							"type": "number",
							"id": "year",
							"placeholder": "Content year",
						},
						{
							"type": "typeahead",
							"id": "collections",
							"item": "collections",
							"placeholder": "Collection name"
						},
						{
							"type": "typeahead",
							"id": "persons",
							"item": "persons",
							"placeholder": "Main artist name"
						}
					],
					"get_load_mask": {
					},
					"on_submit": [
						"contentsupload_fileupload",
					],
					"on_load": [
					],
				},
				{
					"id": "contentsupload",
					"type": "fileupload",
					"form_action": "upload.php?action=content",
					"submit_mask": {
						"contents_id": "contents_form.id",	
					},
					"dependency": {
						"linked_item": "contents_form.id",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"type": "table",
					"id": "contents",
					"item": "contents",
					//"show_actions": true,
					//"edit": "Open and edit",
					/*"on_load": [
						"appitem_form"
					],*/
					"columns": [
						{
							"id": "title",
							"type": "text",
							"title": "Content title",
							"editable": true
						},
						{
							"id": "description",
							"type": "text",
							"title": "Description",
							"editable": true
						},
						{
							"id": "downloads_ids",
							"type": "text",
							"title": "download ids"
						},
						/*{
							"id": "edit",
							"type": "edit_button",
							"title": "Open and edit",
							"value": "Open and edit"
						}*/
					],
				}
			]
		},
		{
			"id": "recently_added",
			"user_access": "everyone", //"user_access": "everyone",
			/*"get_data": {
				"item": "persons"
			},*/
			"content": [
				{
					"id": "title",
					"type": "content",
					"content": "Recently Added"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "recents",
					"post_data": {
						"persons_id": "id"
					},
					"album_link": true
				},
			]
		},
		{
			"id": "recently_added_alt",
			"user_access": "everyone", //"user_access": "everyone",
			/*"get_data": {
				"item": "persons"
			},*/
			"content": [
				{
					"id": "title",
					"type": "content",
					"content": "Recently Added"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "recents_alt",
					"post_data": {
						"persons_id": "id"
					},
					"album_link": true
				},
			]
		},
		{
			"id": "top_downloads",
			"user_access": "everyone", //"user_access": "everyone",
			/*"get_data": {
				"item": "persons"
			},*/
			"content": [
				{
					"id": "title",
					"type": "content",
					"content": "Top Downloads"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "top",
					"post_data": {
						"persons_id": "id"
					},
					"album_link": true,
					//"cache": (24*60*1),
				},
			]
		},
		{
			"id": "location",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "locations"
			},
			"no_php_get": true,
			"content": [
				{
					"type": "content",
					"id": "title"
				},
				{
					"type": "content",
					"id": "relatedtitle",
					"content": "Composers from this location"
				},
				{
					"id": "subpersons",
					"type": "related",
					"target_page": "person",
					"from_page_data": "persons",
					//"cache": (24*60*5),
					/*"post_data": {
						"id": "id"
					}*/

				},
				{
					"type": "content",
					"id": "relatedtitle",
					"content": "Locations"
				},
				{
					"id": "subpersons",
					"type": "related",
					"target_page": "location",
					"from_page_data": "locations",
					"reverse": true,
					//"cache": (24*60*5),
					/*"post_data": {
						"id": "id"
					}*/

				},
			]
		},
		{
			"id": "person",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "persons"
			},
			"no_php_get": true,
			"animation": [
				{
					"from_page": "person",
					"type": "slide_in"
				},
				{
					"from_page": "collections",
					"type": "slide_in"
				},
				{
					"from_page": "album",
					"type": "slide_in"
				}
			],
			"content": [
				{
					"id": "name",
					"type": "content"
				},
				{
					"type": "link",
					"id": "up_button",
					"content": "Go to Collection",
					"target_href": "collections",
					"target_frame": 3,
					"post_data": {
						"id": "collections_id"
					},
					"dependency": {
						"linked_item": "collections_id",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"type": "editablecontent",
					"id": "persons",
					"item": "persons",
					"post_data": {
						"persons_id": "id",
						"item": "'persons'"
					},
					"colors": [
						"rgba(0,0,0,0.67)",
						"rgba(255,255,255,0.67)",
						"rgba(20, 255, 255, 0.5)",
						"rgba(255, 20, 20, 0.5)",
						"rgba(255, 206, 105, 0.5)"
					],
					"text_colors": [
						"rgba(255,255,255,0.96)",
						"rgba(0,0,0,0.96)",
					]
				},
				{
					"type": "content",
					"id": "relatedtitle",
					"content": "Composers contained within this tag/composer",
					"dependency": {
						"linked_item": "sub_persons",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"id": "subpersons",
					"type": "related",
					"item": "persons",
					"target_page": "person",
					"from_page_data": "sub_persons",
					"dependency": {
						"linked_item": "sub_persons",
						"value": "set",
						"type": "hide"
					},
					//"cache": (24*60*5),
					/*"post_data": {
						"id": "id"
					}*/

				},
				{
					"type": "content",
					"id": "relatedtitle",
					"content": "Location",
					"dependency": {
						"linked_item": "locations",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"id": "locations",
					"type": "related",
					/*"item": "persons",*/
					"target_page": "location",
					"from_page_data": "locations",
					"dependency": {
						"linked_item": "locations",
						"value": "set",
						"type": "hide"
					},
					"reverse": true,
				},
				{
					"title": "Edit composer",
					"type": "form",
					"id": "person",
					"item": "persons",
					"post_data": {
						"id": "id"
					},
					/*"load_from_get": true,*/
					"save": true,
					//"new": true,
					"content": [
						{
							"type": "text",
							"id": "name",
							"placeholder": "Name",
						},
						{
							"type": "text",
							"id": "location",
							"placeholder": "Location",
							"optional_field": true,
						},
						{
							"type": "typeahead",
							"id": "persons",
							"placeholder": "Parent tag/composer",
							"item": "persons",
							"optional_field": true
						},
						/*{
							"type": "text",
							"id": "description",
							"placeholder": "Collection description",
						},
						{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						}*/
					],
					"get_load_mask": {
						"id": "id"
					},
					/*"on_submit": [
						"collections_grid",
						"collectionsimage_fileupload"
					],
					"on_load": [
						"collectionsimage_fileupload"
					],*/
					"dependency": {
						"linked_item": "can_edit",
						"value": "set",
						"type": "hide"
					},
				},
				/*{
					"type": "map",
					"id": "mainmap",
					"post_data": {
						"location": "location"
					},
				},*/
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "persons",
					"sort_items_by_year": true,
					"post_data": {
						"persons_id": "id"
					},
					"album_link": true
				},
				{
					"type": "content",
					"id": "relatedtitle",
					"content": "Collections containing this artist:"
				},
				{
					"id": "relateditems",
					"type": "related",
					"item": "persons",
					"target_page": "collections",
					//"cache": (24*60*5),
					"post_data": {
						"id": "id"
					}

				}
			]
		},
		{
			"id": "collections",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "collections"
			},
			"animation": [
				{
					"from_page": "album",
					"type": "slide_in"
				},
				{
					"from_page": "person",
					"type": "slide_in"
				}
			],
			/*"animation": [
				{
					"from_page": "collections",
					"type": "slide_in"
				}
			],*/
			"content": [
				{
					"type": "link",
					"id": "up_button",
					"content": "Go Up",
					"target_href": "collections",
					"target_frame": 3,
					"post_data": {
						"id": "parent_id"
					},
					"dependency": {
						"linked_item": "parent_id",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"type": "link",
					"id": "person_button",
					"content": "Go to Tag",
					"target_href": "person",
					"target_frame": 3,
					"post_data": {
						"id": "persons_id"
					},
					"dependency": {
						"linked_item": "persons_id",
						"value": "set",
						"type": "hide"
					},
				},
				{
					"type": "content",
					"id": "title"
				},
				{
					"type": "editablecontent",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"collections_id": "id",
						"item": "'collections'"
					},
					"colors": [
						"rgba(0,0,0,0.67)",
						"rgba(255,255,255,0.67)",
						"rgba(20, 255, 255, 0.5)",
						"rgba(255, 20, 20, 0.5)",
						"rgba(255, 206, 105, 0.5)"
					],
					"text_colors": [
						"rgba(255,255,255,0.96)",
						"rgba(0,0,0,0.96)",
					]
				},
				{
					"type": "grid",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"collections_id": "id"
					},
					"image_location": "images",
					//"title_as_image": true,
					"click": "collections",
					"target": "collections_form",
					//"if_can_edit_only": true,
					/*"dependency": {
						"linked_item": "has_collections",
						"value": "set",
						"type": "hide"
					},*/
					//"template_target_selector": ".apps_container_main",
				},
				{
					"title": "Add sub collection",
					"type": "form",
					"id": "collections",
					"item": "collections",
					"post_data": {
						"collections_id": "id"
					},
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Collection title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Collection description",
						},
						{
							"type": "text",
							"id": "artist",
							"placeholder": "Collection main artist",
							"optional_field": true
						},
						{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						},
						{
							"type": "select",
							"id": "collections",
							"item": "collections",
							"content": "fetch",
							"persist_value": true,
							"default_value": [
								"id"
							]
						}
					],
					"get_load_mask": {
						"collections_id": "id"
					},
					"on_submit": [
						"collections_grid",
						"collectionsimage_fileupload"
					],
					"on_load": [
						"collectionsimage_fileupload"
					],
					"dependency": [
						{
							"linked_item": "can_edit",
							"value": "set",
							"type": "hide"
						},
						/*{
							"linked_item": "has_collections",
							"value": "not_set",
							"type": "hide"
						},*/
					]
				},
				{
					"id": "collectionsimage",
					"type": "fileupload",
					"form_action": "upload.php?action=collections_image",
					"submit_mask": {
						//"connect_value": "'character'",
						"collections_id": "collections_form.id",	
					},
					"dependency": {
						"linked_item": "collections_form.id",
						"value": "set",
						"type": "hide"
					},
					"on_submit": [
						"collections_grid"
					]
				},
				{
					"type": "content",
					"id": "albums_title",
					"content": "Albums"
				},
				{
					"type": "grid",
					"id": "albums",
					"item": "albums",
					"post_data": {
						"collections_id": "id"
					},
					"image_location": "albums_images",
					//"title_as_image": true,
					"click": "album",
					"target": "albums_form",
					//"if_can_edit_only": true,
					/*"dependency": {
						"linked_item": "has_collections",
						"value": "not_set",
						"type": "hide"
					},*/
					//"template_target_selector": ".apps_container_main",
				},
				{
					"title": "Add album/media group to collection",
					"type": "form",
					"id": "albums",
					"item": "albums",
					"post_data": {
						"collections_id": "id"
					},
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Album title",
						},
						{
							"type": "text",
							"id": "description",
							"placeholder": "Album description",
						},
						{
							"type": "number",
							"id": "year",
							"placeholder": "Album year",
						},
						{
							"type": "text",
							"id": "artist",
							"placeholder": "Album artist",
							"optional_field": true
						},
						{
							"type": "hidden",
							"id": "collections_id",
							"persist_value": true
						},
						{
							"type": "select",
							"id": "collections",
							"item": "collections",
							"content": "fetch",
							"default_value": [
								"id"
							]
						}
					],
					"get_load_mask": {
						"collections_id": "id"
					},
					"on_submit": [
						"albums_grid",
						"albumsimage_fileupload"
					],
					"on_load": [
						"albumsimage_fileupload"
					],
					"dependency": [
						/*{
							"linked_item": "has_collections",
							"value": "not_set",
							"type": "hide"
						},*/
						{
							"linked_item": "can_edit",
							"value": "set",
							"type": "hide"
						},
					]
				},
				{
					"id": "albumsimage",
					"type": "fileupload",
					"form_action": "upload.php?action=collections_image",
					"submit_mask": {
						//"connect_value": "'character'",
						"albums_id": "albums_form.id",	
					},
					"dependency": {
						"linked_item": "albums_form.id",
						"value": "set",
						"type": "hide"
					},
					"on_submit": [
						"albums_grid"
					]
				},
				/*{
					"type": "content",
					"id": "featuring_title_2",
					"content": "All tracks"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "tracks",
					//"cache": (24*60*5),
					"post_data": {
						"collections_alt_id": "id"
					}
				},
				{
					"type": "content",
					"id": "featuring_title",
					"content": "Other tracks"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "tracks",
					//"cache": (24*60*5),
					"post_data": {
						"collections_id": "id"
					},
					"no_duplicates": true
				},
				{
					"type": "content",
					"id": "featuring_title",
					"content": "Related"
				},*/
				{
					"type": "content",
					"id": "related_title",
					"content": "Related artists"
				},
				{
					"id": "relateditems",
					"type": "related",
					"item": "collections",
					//"cache": (24*60*5),
					"post_data": {
						"collections_id": "id"
					}

				}
			]

		},
		{
			"id": "lyrics",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "tracks"
			},
			"no_php_get": true,
			"animation": [
				{
					"from_page": "album",
					"type": "overlay"
				},
			],
			"content": [
				{
					"type": "lyrics",
					"id": "lyrics",
					"item": "tracks",
					"post_data": {
						"id": "id"
					},
				}
			]
		},
		{
			"id": "album",
			"user_access": "everyone", //"user_access": "everyone",
			"get_data": {
				"item": "albums"
			},
			"animation": [
				{
					"from_page": "lyrics",
					"type": "unset_overlay"
				},
				{
					"from_page": "collections",
					"type": "slide_in"
				},
				{
					"from_page": "person",
					"type": "slide_in"
				}
			],
			"content": [
				{
					"type": "link",
					"id": "up_button",
					"content": "Go Up",
					"target_href": "collections",
					"target_frame": 3,
					"post_data": {
						"id": "parent_id"
					},
					"dependency": {
						"linked_item": "parent_id",
						"value": "set",
						"type": "hide"
					},
				},
				/*{
					"type": "link",
					"id": "play_button",
					"content": "Play Album",
					"target_href": "player",
					"target_frame": 5,
					"post_data": {
						"albums_id": "id",
						"id": "'-1'"
					},
				},*/
				{
					"type": "content",
					"id": "title"
				},
				/*{
					"type": "content",
					"id": "year"
				},*/
				{
					"type": "content",
					"is_image": true,
					"id": "image",
					"image_location": "albums_images"
				},
				{
					"id": "tracks",
					"type": "tracklist",
					"item": "tracks",
					"post_data": {
						"albums_id": "id"
					},
					"target": "tracks_form"
				},
				{
					"type": "form",
					"id": "tracks",
					"item": "tracks",
					"post_data": {
						"albums_id": "id"
					},
					"save": true,
					"new": true,
					"content": [
						{
							"type": "text",
							"id": "title",
							"placeholder": "Track title",
						},
						{
							"type": "number",
							"id": "track_number",
							"placeholder": "Track number",
						},
						{
							"type": "text",
							"id": "artists",
							"placeholder": "Tags seperated by semicolon ;",
							"tag_check": "tag_check_delimit"
						},
						{
							"type": "text",
							"id": "youtubelink",
							"placeholder": "YouTube Link",
							"optional_field": true
						},
						{
							"type": "text",
							"id": "videolink",
							"placeholder": "YouTube Music Video Link",
							"optional_field": true
						},
						{
							"type": "hidden",
							"id": "albums_id",
							"persist_value": true
						}
					],
					"get_load_mask": {
						"albums_id": "id"
					},
					"on_submit": [
						"tracks_tracklist",
						"downloads_fileupload"
					],
					"on_load": [
						"downloads_fileupload"
					],
					"dependency": [
						{
							"linked_item": "can_edit",
							"value": "set",
							"type": "hide"
						},
					]
				},
				{
					"id": "downloads",
					"type": "fileupload",
					"form_action": "upload.php?action=downloads",
					"submit_mask": {
						//"connect_value": "'character'",
						"tracks_id": "tracks_form.id",	
					},
					"dependency": {
						"linked_item": "tracks_form.id",
						"value": "set",
						"type": "hide"
					},
					"on_submit": [
						"tracks_tracklist",
					]
				},
			]
		},
		{
			"id": "locations",
			"user_access": "admin",
			"content": [
				{
					"type": "content",
					"id": "description",
					"content": "Here you can manage locations"
				}
			]
		},
		{
			"id": "new_app",
			"user_access": "user",
			"animation": [
				{
					"from_page": "about",
					"type": "slide_in"
				},
			],
			"get_data": {
				"item": "appitem"
			},
			"content": [
				/*{
					"type": "content",
					"content": "Start by typing in the app name, then you will get a unique identifier for your app which you can use to access this page and view the progress on your application"
				},*/
				{
					"type": "content",
					"id": "currentlyediting",
					"content": "To start filling in the app details you must either add new app to the table below by filling in the form and press save or select an app from the table below and click open and edit.",
					"dependency": {
						"linked_item": "appitem_form.id",
						"value": "not_set",
						"type": "hide"
					}
				},
				{
					"type": "content",
					"id": "currentlyediting",
					"content": "Currently editing. Your are now editing an app, which lets you access the menu to your left, where you can configure your app.",
					"dependency": {
						"linked_item": "appitem_form.id",
						"value": "set",
						"type": "hide"
					}
				},
				{
					"id": "appitem",
					"type": "form",
					"save": "Save App",
					"new": "after_save",
					"item": "appitem",
					//"peristant_values": true,
					//"load_on_submit": true,
					"content": [
						{
							"id": "name",
							"placeholder": "App Name",
							"type": "text"
						},
						{
							"id": "appidentifier",
							"placeholder": "App Identifier",
							"type": "text"
						},
						{
							"id": "description",
							"type": "textarea",
							"placeholder": "App Description"
						}
						/*{
							"id": "uid",
							"type": "text",
							"placeholder": "App ID (Leave this field empty)",
							"readonly": true,
						}*/
					],
					"on_submit": [
						"apps_table"
					],
					/*"set_get_data_id": {

					},*/
					"on_load_target_href": ["mainmenu_app", "new_app"],
					"on_load_target_frame": [2, 3],
					"on_load_target_href_post_data": {
						"id": "id"
					},
					"get_load_mask": {
						"id": "id"
					},
					
				},
				{
					"type": "table",
					"id": "apps",
					"item": "appitem",
					"show_actions": true,
					//"edit": "Open and edit",
					"on_load": [
						"appitem_form"
					],
					"columns": [
						{
							"id": "name",
							"type": "text",
							"title": "App Name",
							"editable": true
						},
						{
							"id": "description",
							"type": "text",
							"title": "Description",
							"editable": true
						},
						{
							"id": "edit",
							"type": "edit_button",
							"title": "Open and edit",
							"value": "Open and edit"
						}
					],
					"target": "appitem_form"
				}
				/*{
					"type": "content",
					"editable": true,
					"content": "App Name",
					"class": "editable_field"
				}*/
				/*{
					"type": "frame",
					"id": 4,
					"default_page": "mainmenu_app",
					"template_target_selector": ".frame2_container",
				},
				{
					"type": "frame",
					"id": 5,
					"default_page": "new_app_content",
					"template_target_selector": ".frame3_container",
				},*/
			]
		},
		{
			"id": "selected_platforms",
			"content": [
				{
					"type": "content",
					"content": "Select which platforms you want to use for your application."
				},
				{
					"type": "form",
					"id": "platform",
					"item": "platform",
					"save": true,
					"get_load_mask": {
						"app_id": "id"
					},
					"load_from_get": true,
					"content": [
						{
							"type": "hidden",
							"id": "app_id",
						},
						{
							"type": "checkbox",
							"id": "web",
							"caption": "Web Application"
						},
						{
							"type": "checkbox",
							"id": "macos",
							"caption": "macOS Application"
						},
						{
							"type": "checkbox",
							"id": "windows",
							"caption": "Windows Application"
						}
					]
				},
				{
					"type": "content",
					"content": "If you select macOS and Windows, the implementations will be as identical as is possible. If you select a web application as well as windows or macOS application you will need to specify in the implementation details what differences, if any, are between the web application and the desktop version."
				},
			]
		},
		{
			"id": "list_functionality",
			"content": [
				{
					"type": "content",
					"content": "Here you list the functionality for your application. You can add sub functionalities by selecting an item and pressing the add item button. You can also drag and drop items to reorganize them."
				},
				/*{
					"type": "form",
					"id": "generaldescription",
					"item": "functionalitydescription",
				},*/
				{
					"type": "tree",
					"id": "functionality",
					"item": "functionality",
					"post_data": {
						"app_id": "id"
					},
					"new_item_title": "Functionality title",
					"new_item_content": "Functionality description",
					//"add_new_label": "Add new functionality"
				}
			]
		},
		/*{
			"id": "sketches",
			"content": [
				{
					"type": "content",
					"content": "Here you list the functionality for your application. You can add sub functionalities by selecting an item and pressing the add item button. You can also drag and drop items to reorganize them."
				},
			]
		},*/
		{
			"id": "sketches",
			"content": [
				{
					"type": "content",
					"content": "Here you can choose the colors you want to use for your application. You can also specify which color value is assigned to which UI element in uploaded sketches or designs by using the desired color or by using the hex value for the color."
				},
				{
					"type": "colorpallete",
					"id": "maincolors",
					"item": "appitem",
					"post_data": {
						"app_id": "id"
					},
				}
			]
		},
		{
			"id": "about",
			/*"animation": [
				{
					"from_page": "new_app",
					"type": "slide_in"
				}
			],*/
			/*"get_data": {
				"item": "torrents",
			},
			//"editing_dependant": true,*/
			"content": [
				/*{
					"type": "content",
					//"content": "test123",
					"content_selector": ".introduction_about"
				},
				{
					"type": "link",
					"content": "Start a new app",
					"target_href": ["mainmenu_app", "new_app"], //, , "new_app_content"],//"0:new_app:;2:mainmenu_app:;3:new_app_content:;",
					"template_target_selector": ".start_button",
					"target_frame": [2, 3], //, 2, 3],
				}*/
				{
					"id": "intro",
					"type": "content",
					"content": "No content"
				}
			]
		},
		{
			"id": "forum",
			/*"animation": [
				{
					"from_page": "new_app",
					"type": "slide_in"
				}
			],*/
			/*"get_data": {
				"item": "torrents",
			},
			//"editing_dependant": true,*/
			"content": [
				/*{
					"type": "content",
					//"content": "test123",
					"content_selector": ".introduction_about"
				},
				{
					"type": "link",
					"content": "Start a new app",
					"target_href": ["mainmenu_app", "new_app"], //, , "new_app_content"],//"0:new_app:;2:mainmenu_app:;3:new_app_content:;",
					"template_target_selector": ".start_button",
					"target_frame": [2, 3], //, 2, 3],
				}*/
				{
					"id": "intro",
					"type": "content",
					"content": "No content"
				}
			]
		},
		{
			"id": "home",
			"template": ".home_template",
			"content": [
				{
					"limit": 1,
					"type": "newslist",
					"id": "newsmain",
					"target_frame": "self",
					"template": ".news_item",
					"item": "news",
					"editable": "admin",
					"template_target_selector": ".news_item_main",
					"item_content": [
					]
				},
				{
					"type": "grid",
					"id": "apps",
					"item": "apps",
					"image_location": "images",
					"title_as_image": true,
					"click": "view_app",
					"template_target_selector": ".apps_container_main",
				},
			]
		},
		{
			"id": "user_groups",
			"user_access": "user",
			"content": [
				{
					"type": "form",
					"id": "usergroup",
					"title": "Manage User Groups",
					"save": true,
					"new": true,
					"item": "usergroup",
					"content": [
						{
							"type": "text",
							"id": "group_name",
							"placeholder": "User Group Name"	
						},
						{
							"type": "select",
							"id": "parent_group",
							"caption": "Parent Group",
							"content": "fetch",
							"post_data": {
								"application_id": "id"
							},
							"reload_on_save": true,
						},
						{
							"type": "hidden",
							"id": "application_id",
							"persist_value": true
						}	
					],
					"on_submit": [
						/*{	
							"link": "user_groups_table",
							"load_mask": "false"
						},*/
						"usergroups_table",
						//"news_images_table"
					],
					"get_load_mask": {
						"application_id": "id"
					},
					/*"dependencies": [
						{
							"link": "application_form.id",
							"value": "set"
						}
					],*/
				},
				{
					"type": "table",
					"id": "usergroups",
					"item": "usergroup",
					"show_actions": true,
					//"edit": "Open and edit",
					"on_load": [
						"usergroup_form"
					],
					"columns": [
						{
							"id": "group_name",
							"type": "text",
							"title": "Group Name",
							"editable": true
						},
						{
							"id": "parent_group",
							"type": "text",
							"title": "Parent Group",
							//"editable": true
						},
						{
							"id": "edit",
							"type": "edit_button",
							"title": "Edit",
							"value": "Edit"
						}
					],
					"target": "usergroup_form",
					"post_data": {
						"application_id": "id"
					}
				}
			]
		},
		{
			"id": "data_structure",
			"title": "App Data Structure",
			"no_get_data": true,
			//"icon_i": 'icofont-bars',
			//"animation": "slide",
			//"click": "exam",
			/*"breadcrumb": {
				"parent": "my_apps",
				"children": [

				]
			},*/
			"user_access": "user",
			"content": [
				/*{
					"type": "breadcrumb",
					"id": "breadcrumb"
				},*/
				{	
					"id": "nodes",
					"id_singular": "node",
					"type": "diagrameditor",
					"item": "node",
					"target_page": "data_element",
					"target_frame": 3,
					"target_post_data": {
						"application_id": "id"
					},
					"post_data": {
						"application_id": "id"
					},
					"node_info": "node_form"
				},
				/**/
			]	
		},
		{
			"id": "data_element",
			"content": [
				{
					"type": "form",
					"id": "node",
					"item": "node",
					"save": true,
					"cancel": true,
					"delete": true,
					"navigate_back_on_complete": true,
					"content": [
						{
							"type": "text",
							"id": "name",
							"placeholder": "Node name"
						},
						{
							"type": "radio",
							"id": "node_type",
							"content": {
								"additive": "Additive",
								"subtractive": "Subtractive"
							}
						},
						{
							"caption": "User Access",
							"type": "select",
							"id": "user_access",
							"content": "fetch",
							"item": "usergroup",
							"post_data": {
								"application_id": "application_id"
							}	
						},
					],
					"get_load_mask": {
						"id": "id"
					}
					/*"on_submit": [
						"nodes_diagram_editor"
					]*/
				}
			]
		},
		{
			"id": "mainmenu_app",
			"user_access": "user",
			"get_data": {
				"item": "appitem"
			},
			"animation": [
				{
					"from_page": "mainmenu",
					"type": "slide_in"
				}
			],
			"content": [
				{
					"type": "menu",
					"id": "mainleft",
					"target_frame": 3,
					"content": [
						{
							"content": "My Apps",
							"target_href": "new_app",
							"target_persist_get_data": true,
							"post_data": {
								"id": "id"
							}
						},
					]
				},
				{
					"type": "menu",
					"id": "mainleftsub",
					"target_frame": 3,
					"dependency": {
						"linked_item": "started",
						"type": "disabled",
						"value": "set"
					},
					"content": [
						{
							"content": "User Groups",
							"target_href": "user_groups",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Data Structure",
							"target_href": "data_structure",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Interface Design",
							"target_href": "interface_design",
							"post_data": {
								"id": "id"
							}
						},
						/*{
							"content": "Interface Design",
							"target_href": "interface_design",
							"post_data": {
								"id": "id"
							}
							"children": [

							]
						},*/
						/*{
							"content": "Color Pallete & Designs",
							"target_href": "sketches",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Icon",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Audio",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Store Listing",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},*/
					]
				},
				/*{
					"type": "menu",
					"id": "responsemenu",
					"target_frame": 3,
					"dependency": {
						"linked_item": "processed",
						"type": "disabled",
						"value": "set"
					},
					"content": [
						{
							"content": "Estimated Project Time",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Initial Objectives",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Further Requested Information",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Task List",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Product",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
						{
							"content": "Bug Reports",
							"target_href": "about",
							"post_data": {
								"id": "id"
							}
						},
					]
				}*/
			]
		},
		{
			"id": "mainmenu",
			"animation": [
				{
					"from_page": "mainmenu_app",
					"type": "slide_in"
				}
			],
			"content": [
				{
					"type": "menu",
					"id": "mainleft",
					"target_frame": 3,
					"content": [
						{
							"content": "Start Page",
							"target_href": "about",
						},
						{
							"content": "Platforms & Technologies",
							"target_href": "about",
						},
						{
							"content": "Contact",
							"target_href": "about",
						},
						/*{
							"content": "Buyers",
							"target_href": "buyers",
						},
						{
							"content": "Books",
							"target_href": "books",
						},*/
						/*{
							"content": "News",
							"target_href": "news",
						},
						{
							"content": "Entertainment",
							"target_href": "view_apps",
							"post_data": {
								"id": "'1'"
							},
							"children": [
								{
									"content": "Noob Media Center",
									"target_href": "view_app",
									"post_data": {
										"id": "'3'"
									}
								},
								{
									"content": "Noob Music",
									"target_href": "view_app",
									"post_data": {
										"id": "'4'"
									}
								},
								{
									"content": "Noob Player",
									"target_href": "view_app",
									"post_data": {
										"id": "'5'"
									}
								},
								{
									"content": "Noob TV",
									"target_href": "view_app",
									"post_data": {
										"id": "'6'"
									}
								},
								{
									"content": "Noob Cinema",
									"target_href": "view_app",
									"post_data": {
										"id": "'7'"
									}
								}
							]
						},
						{
							"content": "Utilites",
							"target_href": "view_apps",
							"post_data": {
								"id": "'2'"
							},
							"children": [
								{
									"content": "Noob NumRand",
									"target_href": "view_app",
									"post_data": {
										"id": "'8'"
									}
								},
								{
									"content": "Noob Interval Notifier",
									"target_href": "view_app",
									"post_data": {
										"id": "'9'"
									}
								},
							]
						},
						{
							"content": "About",
							"target_href": "about",
						},
						{
							"content": "Privacy",
							"target_href": "privacy",
						},*/
					]
				}
			]
		},
		{
			"id": "test_page_2",
			"animation": [
				{
					"from_page": "test_page",
					"type": "overlay"
				}
			],
			"content": [
				/*{
					"type": "select",

				},*/
				{
					"type": "content",
					"content": "Welcome to another test page."
				},
				{
					"type": "link",
					"content": "Goto first page",
					"target_frame": 3,
					"target_href": "test_page"
				}
			]
		},
		{
			"id": "test_page",
			"animation": [
				{
					"from_page": "test_page_2",
					"type": "unset_overlay"
				}
			],
			"content": [
				
				{
					"type": "content",
					"content": "Welcome to test page."
				},
				{
					"type": "link",
					"content": "Goto",
					"target_frame": 3,
					"target_href": "test_page_2"
				}
			]
		},
		{
			"id": "intro2",
			"content": [
				
				{
					"type": "content",
					"content": "Welcome to another page."
				},
				{
					"type": "link",
					"content": "Goto",
					"target_frame": 2,
					"target_href": "introduction"
				}
			]
		},
		{
			"id": "introduction",
			"datasources": [
				'einhver_tafla',
				'einhver_onnur_tafla'
			],
			"content": [
				{
					"type": "content",
					"content": "Welcome."
				},
				{
					"type": "link",
					"content": "Goto",
					"target_frame": 2,
					"target_href": "intro2"
				}
				/*{
					"type": "list",
					"id": "news",
					"target_template_selector": ".news_container",
					"item_target_template_selector": ".news_item",
					"editable": true, 
					"content": [
						{
							"type": "displayinput",
							"id": "title",
							"multiline": false,
							"item_target_selector": ".news_title",
							"placeholder": "News item title"
						},
						{
							"type": "editablecontent",
							"id": "content",
							"item_target_selector": ".news_main_content"
						},
					]
				}*/
				/*{
					"type": "form", editablecontent/cinema esq frekar?
					"id": "page",
					"content": [
						{
							"type": "text",
							"id": "title"
						}
					]
				}*/
			]
		},
		{
			"id": "sidebar",
			"global_overlay": true,
			"content": [
				{
					"type": "content",
					"content": "Welcome."
				}
			]
		},
		{
			"id": "interface_design",
			"title": "Interface Design",
			"no_get_data": true,
			"user_access": "user",
			"item": "page",
			//"breadcrumb_no_get_data": true,
			/*"breadcrumb": {
				"parent": "my_apps",
				"children": [
					"interface_diagram"
				]
			},*/
			"content": [
				/*{
					"type": "breadcrumb",
					"id": "breadcrumb"
				},*/
				{
					"type": "form",
					"id": "page",
					"item": "page",
					"content": [
						{
							"type": "text",
							"id": "name",
							"placeholder": "Page Name"	
						},
						{
							"type": "text",
							"id": "title",
							"placeholder": "Page Title"	
						},
						{
							"type": "text",
							"id": "icon",
							"placeholder": "Page Icon (icofont / fontawesome class)",
							"optional_field": true	
						},
						{
							"caption": "User Access",
							"type": "select",
							"id": "user_access",
							"item": "usergroup",
							"content": "fetch",
							"post_data": {
								"application_id": "id"
							}	
						},
						{
							"id": "application_id",
							"type": "hidden",
							"persist_value": true
						},
						{
							"type": "textarea",
							"id": "definition_addition",
							"json_content": true,
							"placeholder": "Definition Addition",
							"display_title": true,
							"enable_tab": true,
							"optional_field": true
						}
					],
					"save": true,
					"new": true,
					//new_on_save": true,
					"on_submit": [
						"pages_table"
					],
					"get_load_mask": {
						//"id": "application_id",
						"application_id": "id",
					},	
					//"error_message": "Make sure you choose a name for your property and select a property type from the drop down menu."
				},
				{
					"id": "pages",
					"type": "table",
					"item": "page",
					"post_data": {
						"application_id": "id"
					},
					/*"columns": {
						"name": "Name",
						"title": "Title",
					},*/

					"columns": [
						{
							"id": "name",
							"type": "text",
							"title": "Page Name",
							"editable": true
						},
						{
							"id": "title",
							"type": "text",
							"title": "Title",
							"editable": true
						},
						{
							"id": "edit",
							"type": "edit_button",
							"title": "Edit",
							"value": "Edit"
						},
						{
							"id": "interface_diagram_button",
							"type": "custom_action",
							"title": "Interface Diagram",
							"target_href": "interface_diagram",
							"href_data": {
								"id": "id"
							},
						}
					],
					/*"custom_columns": {
						"complete": "Complete",
					},*/
					/*"column_width": {
						"name": "auto",
						"title": "auto",
						"edit_button": "120px",
						"delete_button": "120px",
						"interface_diagram_button": "150px",
					},
					"extra_class": {
						"title": "truncate"
					},*/
					"target": "page_form",
					"delete": true,
					"edit": true,
					"custom_actions": {
						"interface_diagram_button": {
							"target_href": "interface_diagram",
							"href_data": {
								"id": "id"
							},
							"value": "Interface Diagram"
						}
					}
					/*"on_load": [
						"object_calendar"
					],*/
					/*"custom_actions": {
						"complete": {
							"action": "complete_objective_table",
							"value": "checkbox"
						},
					}*/
				}
			]
		}
	],
	/*"global_overlays": [

	]*/
};