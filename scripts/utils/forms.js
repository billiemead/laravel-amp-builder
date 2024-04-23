(function () { "use strict";
	
	$.fn.forms=function(o){
		return this.each(function(){
			var th=$(this)
				,_= {
					errorCl:'err',
					emptyCl:'require',
					invalidCl:'invalid',
					notRequiredCl:'notRequired',
					successCl:'success',
					successShow:'4000',
					mailHandlerURL:'MailHandler.php',
					ownerEmail:'support@guardlex.com',
					stripHTML:true,
					smtpMailServer:'localhost',
					targets:'input:password,input:text,textarea,select',
					targets2:'input:checkbox:checked, input:radio:checked',
					controls:'a[data-type=reset],a[data-type=submit]',
					validate:true,
					type:'contact',
					rx:{
						".name":{rx:/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/,target:'input'},
						".state":{rx:/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/,target:'input'},
						".email":{rx:/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,target:'input'},
						".phone":{rx:/^\+?(\d[\d\-\+\(\) ]{5,}\d$)/,target:'input'},
						".fax":{rx:/^\+?(\d[\d\-\+\(\) ]{5,}\d$)/,target:'input'},
						".message":{rx:/.{20}/,target:'textarea'}
					},
					preFu:function(){
						_.labels.each(function(){
							var label=$(this),
								inp=$(_.targets,this),
								defVal=inp.val(),
								trueVal=(function(){
											var tmp=inp.is('input:text')?(tmp=label.html().match(/value=['"](.+?)['"].+/),!!tmp&&!!tmp[1]&&tmp[1]):inp.html()
											return defVal==''?defVal:tmp
										})()
							trueVal!=defVal
								&&inp.val(defVal=trueVal||defVal)
							label.data({defVal:defVal})								
							inp
								.on('focus',function(){
									inp.val()==defVal
										&&(inp.val(''),_.hideEmptyFu(label),label.removeClass(_.invalidCl))
								})
								.on('blur',function(){
									_.validateFu(label)
									if(_.isEmpty(label))
										inp.val(defVal)
										,_.hideErrorFu(label.removeClass(_.invalidCl))											
								})
								.on('keyup',function(){
									label.hasClass(_.invalidCl)
										&&_.validateFu(label)
								})
							label.find('.'+_.errorCl+',.'+_.emptyCl).css({display:'block'}).hide()
						})
						_.success=$('.'+_.successCl,_.form).hide()
					},
					isRequired:function(el){							
						return !el.hasClass(_.notRequiredCl)
					},
					isValid:function(el){							
						var ret=true
						$.each(_.rx,function(k,d){
							if(el.is(k))
								ret=d.rx.test(el.find(d.target).val())										
						})
						return ret							
					},
					isEmpty:function(el){
						var tmp
						return ((tmp=el.find(_.targets).val())==''||tmp==el.data('defVal')) && el.find(_.targets2).length==0;
					},
					validateFu:function(el){							
						el.each(function(){
							var th=$(this)
								,req=_.isRequired(th)
								,empty=_.isEmpty(th)
								,valid=_.isValid(th)								
							
							if(empty&&req)
								_.showEmptyFu(th.addClass(_.invalidCl))
							else
								_.hideEmptyFu(th.removeClass(_.invalidCl))
							
							if(!empty)
								if(valid)
									_.hideErrorFu(th.removeClass(_.invalidCl))
								else
									_.showErrorFu(th.addClass(_.invalidCl))								
						})
					},
					getValFromLabel:function(label){
						var val=$('input,textarea',label).val()
							,defVal=label.data('defVal')								
						return label.length?val==defVal?'nope':val:'nope'
					}
					,submitFu:function(){
						_.validateFu(_.labels)							
						if(!_.form.has('.'+_.invalidCl).length){
							var form_name = _.form.attr('name');
							var a = {};
							a['form'] = [];
							a['key'] = [];
							_.labels.each(function()
							{
								var t = $(this);
								var n = t.children('p');
								var name = $.trim(n.html());
								var p = $('input:hidden, input:text,textarea,select,input:radio:checked',this);
								var q = $('input:checkbox:checked',this);
								if(p.length > 0)
								{
									p.each(function()
									{
										var name = $(this).attr('name');
										var v = $(this).val();
										a['key'].push( name );
										a['form'].push( v);
									});
								}
								else if(q.length > 0)
								{
									
									q.each(function()
									{
										var id = this.id;
										var i = id.split('_')[2];
										a['key'][i] = name;
										a['form'][i] = (a['form'][i] == undefined) ? $(this).val() : (a['form'][i] + ',' + $(this).val());
									});
								}
							});
							var data = a;
							
							if(form_name != undefined && form_name.length)
							{
								data ={};
								data[form_name] = a;
							}
							data.YII_CSRF_TOKEN = $('input[name="YII_CSRF_TOKEN"]',_.form).val();
							if(_.type == 'contact')
							{
								a.owner_email = _.ownerEmail;
								a.stripHTML=_.stripHTML;
								$.ajax({
									type: "POST",
									url:_.mailHandlerURL,
									data:data,
									success: function(){
										_.showFu()
									}
								});
							}
							else if(_.type == 'comment')
							{
								_.form[0].submit();
							}
						}
					},
					showFu:function(){
						_.success.slideDown(function(){
							setTimeout(function(){
								_.success.slideUp()
								_.form.trigger('reset')
							},_.successShow)
						})
					},
					controlsFu:function(){
						$(_.controls,_.form).each(function(){
							var th=$(this)
							th
								.on('click',function(){
									_.form.trigger(th.data('type'))
									return false
								})
						})
					},
					showErrorFu:function(label){
						label.find('.'+_.errorCl).slideDown()
					},
					hideErrorFu:function(label){
						label.find('.'+_.errorCl).slideUp()
					},
					showEmptyFu:function(label){
						label.find('.'+_.emptyCl).slideDown()
						_.hideErrorFu(label)
					},
					hideEmptyFu:function(label){
						label.find('.'+_.emptyCl).slideUp()
					},
					init:function(){
						_.form=_.me						
						_.labels=$('.controls',_.form)

						_.preFu()
						
						_.controlsFu()
														
						_.form
							.on('submit',function(){
								if(_.validate)
									_.submitFu()
								else
									_.form[0].submit()
								return false
							})
							.on('reset',function(){
								_.labels.removeClass(_.invalidCl)									
								_.labels.each(function(){
									var th=$(this)
									_.hideErrorFu(th)
									_.hideEmptyFu(th)
								})
							})
						_.form.trigger('reset')
					}
				}
			_.me||_.init(_.me=th.data({forms:_}))
			typeof o=='object'
				&&$.extend(_,o)
		})
	}
})(jQuery)
