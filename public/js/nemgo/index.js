
Nemgo = function(options){

	var self = this;

	for(var key in options){
		if(options.hasOwnProperty(key)){
			self[key] = options[key];
		}
	}

	this.readFieldConfigFromServer = function(done){
		Ext.Ajax.request({
									url				:		self.url + '/config',
									method		:		'GET',
									success		:		function(response){
										console.log(response);
										var response = JSON.parse(response.responseText);
										console.log(response);
										self.fields = self.buildFieldConfigFromSchemaConfig(response);
										done();
									}
								});
	};

	this.buildFieldConfigFromSchemaConfig = function(response){
		var fields = [];
		if(typeof response.data !== 'undefined'){
			if(typeof response.data.paths !== 'undefined'){
				for(var key in response.data.paths){
					if(key !== '__v'){
						var type = 'string';
						switch(response.data.paths[key].Instance){
							case 'String':
								break;
							case 'Number':
								type = 'int';
								break;
							case 'Date':
								type = 'date';
								break;
							case 'Boolean':
								type = 'bool';
								break;
							case 'Objectid':
								type = 'string';
								break;
						}
						fields.push({name:key,type:type});

					}
				}
			}
		}
		return fields;
	};

	this.getStoreFieldConfig = function(){
		if(typeof self.options.fields !== 'undefined'){
			return self.options.fields;
		}
		return {};
	};

	this.build = function(options){
		console.log(options);

		if(typeof self.fields === 'undefined'){
			self.readFieldConfigFromServer(function(){
				self.buildGrid(options);				
			});
		}else{
			self.buildGrid(options);	
		}
	};

	this.getColumns = function(){
		var columns = [];

		for (var i = 0; i < self.fields.length; i++) {
			columns.push(self.getColumnFromField(self.fields[i]));
		}

		return columns;
	};

	this.getColumnFromField = function(field){
		switch(field.type){
			case 'string':
			case 'text':
				return {
            header: field.name,
            dataIndex: field.name,
            flex: 1,
            editor: {
            }
        };
			case 'date':
				return {
            header: field.name,
            dataIndex: field.name,
            flex: 1,
            editor: {
                xtype: 'datefield',
                format: 'd.m.Y'
            }
        };

			case 'int':
				return {
            header: field.name,
            dataIndex: field.name,
            flex: 1,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                format: 'd.m.Y'
            }
        };
		}
		return {};
	};

	this.lib = {
		addSelfPropToObject: function(keys,obj){
			for (var i = 0; i < keys.length; i++) {
				if(typeof self[keys[i]] !== 'undefined'){
					obj[keys[i]] = self[keys[i]];
				}
			}
		}
	};

	this.buildGrid = function(options){
		var gridConfig = {
        store: self.getStore(),
        height:'100%',
        width:'100%',
        columns: self.getColumns(),
        renderTo: options.destination_id,
        tbar: [self.buildAddButton(),self.buildUpdateButton()],
        plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        listeners:{
					edit:{
						fn:function(){
							console.log('edit');
						}
					}
        },
    
    })],dockedItems: [{
        xtype: 'pagingtoolbar',
        store: self.getStore(),
        dock: 'bottom',
        displayInfo: true
    }]
    };

    self.lib.addSelfPropToObject(
		[
			'title'
		],
		gridConfig);

		return Ext.create('Ext.grid.Panel', gridConfig);
	};

	this.buildAddButton = function(){
		return {
            text		: 'create',
            handler : function() {
                Ext.Ajax.request({
									url				:		self.url + '/create',
									method		:		'POST',
									params		:		{obj:{}},
									success		:		function(response){
										console.log(response);
										console.log(self.getStore());
										self.getStore().reload();
									}
								}); 
            }
        };
	};

	this.buildUpdateButton = function(){
		return {
            text		: 'update',
            handler : function() {
								var mod_records = self.getStore().getModifiedRecords();
								var data = [];
								for (var i = 0; i < mod_records.length; i++) {
									if(typeof mod_records[i].data !== 'undefined'){
										data.push(mod_records[i].data);
									}
								}
                Ext.Ajax.request({
									url				:		self.url + '/update',
									method		:		'POST',
									params		:		{data:JSON.stringify(data)},
									success		:		function(response){
										console.log(response);
										console.log(self.getStore());
										self.getStore().reload();
									}
								}); 
            }
        };
	};

	this.getStore = function(){
		if(typeof self['store'] === 'undefined'){
			self.store = Ext.create('Ext.data.JsonStore', {
	        proxy: new Ext.data.HttpProxy({
						url: self.url + '/read',	
						reader: {
							root: 'data',
							totalProperty: 'count'
						}
					}),
					autoLoad: true,
	        fields	:	self.fields
	    });	
		}
		return self.store;
	};

};