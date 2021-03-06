var status_open_all=false;
var show_note = 0;
var show_starred = 0;
var search_note = false;

function upd_bookmark(pid)
{
	$.post("index.php/main/upd_bookmark/"+pid.toString(), {
		star: (! $("#star_icon_"+pid.toString()).hasClass("icon-white")).toString(),
	note: $("#note_textarea_"+pid.toString()).val()
	});
}

function upd_star(pid)
{
	$("#star_icon_"+pid.toString()).toggleClass("icon-white");
	if ($("#star_icon_"+pid.toString()).attr("title")=='star it')
		$("#star_icon_"+pid.toString()).attr("title",'unstar it');
	else
		$("#star_icon_"+pid.toString()).attr("title",'star it');
	upd_bookmark(pid);
}

function open_note(pid)
{
	if ($(".note_text_tr_"+pid.toString()).css('display')=='none')
	{
		$(".note_text_tr_"+pid.toString()).slideDown('fast');
		$("#note_textarea_"+pid.toString()).focus();
	}
}

function close_note(pid)
{
	upd_bookmark(pid);
	pid=pid.toString();
	if ($("#note_textarea_"+pid).val()!='')
	{
		$("#note_icon_"+pid).removeClass("icon-white");
		$(".note_text_tr_"+pid).addClass("note_text_tr_nonempty");
	}
	else
	{
		$("#note_icon_"+pid).addClass("icon-white");
		$(".note_text_tr_"+pid).removeClass("note_text_tr_nonempty");
	}
	if (status_open_all) return;
	$(".note_text_tr_"+pid).slideUp('fast');
}

function toggle_open_all()
{
	if (status_open_all)
	{
		$("#open_all_icon").removeClass("icon-resize-small");
		$("#open_all_icon").addClass("icon-resize-full");
		$(".note_text_tr").slideUp('fast');
		status_open_all=false;
	} else
	{
		$("#open_all_icon").removeClass("icon-resize-full");
		$("#open_all_icon").addClass("icon-resize-small");
		$(".note_text_tr_nonempty").slideDown('fast');
		status_open_all=true;
	}
}

$(document).ready(function(){
	$('#goto_button').bind('click', function(){
		var pid = $('#goto_pid').val();
		if (pid != '')
		load_page('main/show/' + pid);
		return false;
	});

	$('#search_button').bind('click', function(){
		var query = {};
		if ($('#search_content').val()) query['search'] = encodeURIComponent($('#search_content').val());
		if ($('#filter_content').val()!='0') query['filter'] = $('#filter_content').val();
		if (show_starred) query['show_starred'] = show_starred;
		if (show_note) query['show_note'] = show_note;
		if (search_note) query['search_note'] = search_note;
		if (!query) return false;
		load_page("main/problemset?" + $.param(query));
		return false;
	});

	$('#btn_goto_page').bind('click', function(){
		var page = $('#goto_page').val();
		load_page("main/problemset/" + page);
		return false;
	});

	$('#goto_pid').bind('focus', function(){
		$('#action_form').die();
		$('#action_form').live('keypress', function(event){
			if (event.keyCode == 13 && $('#goto_pid').val() != ''){
				$('#goto_button').click();
				return false;
			}
		})
	});

	$('#search_content').bind('focus', function(){
		$('#action_form').die();
		$('#action_form').live('keypress', function(event){
			if (event.keyCode == 13){
				$('#search_button').click();
				return false;
			}
		})
	});
	
	$('#filter_content').bind('focus', function(){
		$('#action_form').die();
		$('#action_form').live('keypress', function(event){
			if (event.keyCode == 13){
				$('#search_button').click();
				return false;
			}
		})
	});
	
	$('#goto_page').bind('focus', function(){
		$('#action_form').die();
		$('#action_form').live('keypress', function(event){
			if (event.keyCode == 13 && $('#goto_page').val() != ''){
				$('#btn_goto_page').click();
				return false;
			}
		})
	});
	
	$("#search_button").popover({
		html: true,
		trigger: 'manual',
		placement: 'bottom',
		title:'\
			<strong>Advanced Searching</strong> \
			<span id="close_popover" class="close pull-right">&times;</span>',
		content:'\
			<div> \
				<label for="show_starred_content">Only what I starred</label> \
				<input id="show_starred_content" class="pull-right" type="checkbox" onclick="show_starred=1-show_starred"></input> \
			</div> \
			<div> \
				<label for="show_note_content">Only where I have notes</label> \
				<input id="show_note_content" class="pull-right" type="checkbox" onclick="show_note=1-show_note"></input> \
			</div> \
			<div> \
				<label for="search_note_content">Match what I wrote in notes</label> \
				<input id="search_note_content" style="width:100%" onkeydown="search_note=$(this).val()"></input> \
			</div>'
	});
	
	$("#adv_button").bind('click',function(){
		$("#search_button").popover('toggle');
		$('#action_form').die();
		$('#action_form').live('keypress', function(event){
			if (event.keyCode == 13){
				$('#search_button').click();
				return false;
			}
		})
		return false;
	});
	
	$("#close_popover").die();
	$("#close_popover").live('click',function(){
		$("#search_button").popover('hide');
		return false;
	});
});
