exports.register = function(dbhandler){

	
var bookSchema = new dbhandler.Schema({
  name				: String,
  description	: String,
  height	: Number,
  author_id		: [{ 'type': dbhandler.Schema.Types.ObjectId, 'ref': 'Author' }],
  created			: {'type': Date, 'default': Date.now}
});


var book = dbhandler.db.model('Book', bookSchema);


app.dbhandlers.book = new dbhandler.init({
	path: '/book',
	actions:{
		create:{},
		read:{
			parameters:[
				'author_id',
				'_id'
			],
			populate:[
				'author_id'
			],
			sort:{'created':'-1'},
		},
		update:{},
		destroy:{
			parameters:[
				'_id'
			]
		},
		config:{}
	},
	schema:bookSchema,
	db:book
});

}