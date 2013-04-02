blub = function(){

	this.test = function(){

    var store = Ext.create('Ext.data.JsonStore', {
        proxy: new Ext.data.HttpProxy({
						// model:'book',
						url: '/book/read',	
						reader: {
							root: 'data',
							totalProperty: 'count'
						}
						}),
				autoLoad:true,
        fields	:	[
						{
							name: '_id',
							type: 'string'
						},
						{
							name: 'name',
							type: 'string'
						},
						{
							name: 'description',
							type: 'text'
						},
						{
							name: 'created',
							type: 'date'
						}
					]
    });


    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    });

    // create the grid and specify what field you want
    // to use for the editor at each column.
    var grid = 

	}	

};