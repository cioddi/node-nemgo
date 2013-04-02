Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '/bundles/uigengenerator/extjs/ux');

Ext.require([
    'Ext.ux.CheckColumn'
]);

function ShipGrid(target_el_id){

	function create(){

		Ext.Ajax.request({
			url			: 	'/Ship/create',
			success		: 	function(response){
								store.load();
							}									    
		});   
	}
	
	function update(){
	
		var records = store.getUpdatedRecords();
		var da = [];
		for(var i = 0; i < records.length; i++) {
			var record = records[i];
			var jsonData = Ext.encode(records[i].data);
			
			da.push(jsonData);
		}
		var data = '[' + da.join(',') + ']';
		
		Ext.Ajax.request({
			method		:	'post',
			url			: 	'/Ship/update',
			params		: 	{
								data: data
							}, 
			success		: 	function(response){
								var result=eval(response.responseText);
								switch(result){
								case 1:
									
									store.load();
									break;
								}
							}									    
		});   
	}
	
	var delete_entity_id = 0;
	function confirmDeletion(id){

		Ext.Msg.confirm('delete?','Do you really want to delete this entry',function(btn){
		
			if(btn == 'yes'){
				
				destroy(id);
			}
		});
	}
	
	function destroy(id){

		Ext.Ajax.request({
			url			: 	'/Ship/'+id+'/destroy',
			success		: 	function(response){
								store.load();
							}									    
		});   
	}	function DragAndDrop(drag_id,target_id,position){
		
		Ext.Ajax.request({
			method		:	'post',
			url			: 	'/Ship/draganddrop',
			params		: 	{
								drag_id: drag_id,
								target_id: target_id,
								position:position
							}, 
			success		: 	function(response){
								store.load();
							}									    
		});
	}
		
    // create the Data Store
    var store = new Ext.data.Store({
        proxy	:	new Ext.data.HttpProxy({
						url: '/Ship/read',	
					reader: {
				                root: 'items',
				                totalProperty: 'count'
				            }
					}),
		autoLoad:	true,
		
		fields	: 	[
						{
							name: 'id',
							type: 'integer'
													},
						{
							name: 'name',
							type: 'string'
													},
						{
							name: 'size',
							type: 'integer'
													},
						{
							name: 'description',
							type: 'text'
													},
						{
							name: 'img',
							type: 'string'
													},
						{
							name: 'pos',
							type: 'integer'
													},
			        ]
    });

	var gridMenu = Ext.create('Ext.menu.Menu', {    
	    items: [{
				text		:	"delete entry",
				icon		:	"/bundles/uigengenerator/images/delete.png",
				handler	: 	function(){
								confirmDeletion(delete_entity_id);
								delete_entity_id = 0;
							}
							}]
	  });	
	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 1
	    });
    var grid = new Ext.grid.Panel({
        store: store,
        plugins: [cellEditing],
		listeners: {
		      beforeitemcontextmenu: function(view, record, item, index, e)
		      {
		        e.stopEvent();
				delete_entity_id = record.data.id;
				
		        gridMenu.showAt(e.getXY());
		      }
		    },
        columns: [
			{
	            header: 'name',
	            dataIndex: 'name',
	            editor: {
					xtype : 'textfield'
	            		}

			},
			{
	            header: 'size',
	            dataIndex: 'size',
	            editor: {
					xtype : 'numberfield'
	            		}
			},
			{
	            header: 'description',
	            dataIndex: 'description',
	            editor: {
					xtype : 'textfield'
	            		}

			},
			{
	            header: 'img',
	            dataIndex: 'img',
	            editor: {
					xtype : 'textfield'
	            		}

			},
			{
	            header: 'pos',
	            dataIndex: 'pos',
	            editor: {
					xtype : 'numberfield'
	            		}
			},

		],
        renderTo: target_el_id,
        width: '100%',
        height: 500,
        title: 'Ship',
        tbar: [
				{
	           	 	text	:  'update',
		            handler : 	update,
					icon	:	"/bundles/uigengenerator/images/save.gif"
				},{
	           	 	text	: 	'create',
		            handler : 	create,
					icon	:	"/bundles/uigengenerator/images/add.png"
				}
			],
		bbar: Ext.create('Ext.PagingToolbar', {
		            store: store,
		            displayInfo: true,
		            displayMsg: 'Displaying topics {0} - {1} of {2}',
		            emptyMsg: "No topics to display"
		        }),
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: 'Ship_ddg',
                dropGroup: 'Ship_ddg'
            },
            listeners: {
                drop: function(node, data, dropRec, dropPosition) {
					DragAndDrop(data.records[0].get('id'),dropRec.get('id'),dropPosition);
                }
            }
        }
		
		    });

}


function ShipCombo(target_el_id){

	var combo = new Ext.form.ComboBox({
		
	});
}