/** 
 *------------------------------------------------------------------------------
 * @package       T3 Framework for Joomla!
 *------------------------------------------------------------------------------
 * @copyright     Copyright (C) 2004-2013 JoomlArt.com. All Rights Reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 * @authors       JoomlArt, JoomlaBamboo, (contribute to this project at github 
 *                & Google group to become co-author)
 * @Google group: https://groups.google.com/forum/#!forum/t3fw
 * @Link:         http://t3-framework.org 
 *------------------------------------------------------------------------------

 */

 jQuery(document).ready(function($) {
 	var scan = function(tag_btn){
 		$('.b-home_cat_js-b .b-k2_item_wrapper-a').each(function(index, block) {
			var err_ = true;
			$(block).find('.b-k2_item_tags-a .b-k2_item_tags_li-a .b-k2_item_tag-a').each(function(block_tag_index, block_tag) {
				if($(block_tag).text()==$(tag_btn).attr('rel')){
 					err_ = false;
 				}
			});

			if(err_){
 				$(block).attr('style' , 'display: none;');
 			}else{
 				$(block).attr('style' , 'display: inline-block;');
 			}

		});

 		$('.b-home_cat_js-b > .clear').each(function(index, block) {
 			$(block).remove();
 		});
 		c_w = 0;
 		$('.b-home_cat_js-b > .b-k2_item_wrapper-a').each(function(index, block) {
 			if($(block).attr('style') == 'display: inline-block;'){
	 			c_w++;
	 			if(c_w == 4){
	 				console.log('test');
	 				//$('<div class="clear"></div>').insertAfter(block);
	 				c_w == 0;
	 			}
	 		}

 		});
 	}
 	$('.b-home_cat_js-b .b-k2_item_wrapper-a').each(function(index_a, el_a) {
 		$(el_a).find('.b-k2_item_tags-a .b-k2_item_tag-a').each(function(index_b, el_b) {
 			var tags = ''+$(el_a).attr('rel');
 			if(tags!=''){
				var re = '/\s*,\s*/';
				var tagList = tags.split(re);
				var err = false;
	 			$(tagList).each(function(index_c, el_c) {
	 				if(el_c!=$(el_b).text()){
	 					$(el_a).attr('rel',tags+', '+$(el_b).text());
	 				}
	 			});
 			}else{
 				$(el_a).attr('rel',$(el_b).text());
 			}
 		});
 	});



 	$('<div class="row b-tags_filter-a b-tags_filter_js-a"></div>').insertBefore('.b-home_cat_js-b');

 	$('.b-home_cat_js-b .b-k2_item_tag-a').each(function(index_a, el_a) {

 		err = false;//совпадение
 		if($('.b-tags_filter_js-a span').length!=0){
 			$('.b-tags_filter_js-a span').each(function(index_b, el_b) {
 				if($(el_b).text()==$(el_a).text()){
 					err = true;
 				}
 			});
 		}
 		if(err==false){
 			$('.b-tags_filter_js-a').html($('.b-tags_filter_js-a').html()+'<span class="b-k2_item_tag-a" rel="'+$(el_a).text()+'">'+$(el_a).text()+'</span>');
 		}

 	});
 	
 	$('.b-home_cat_js-b .b-k2_item_tag-a').each(function(index, block) {
 		$(block).bind('click', function(){scan(block);});
 	});

 	
 	/*
 	$('.b-k2_item_wrapper-a').each(function(index, block) {
 		$(block).find('.b-k2_item_tag-a').each(function(block_tag_index,block_tag) {
 			$(block_tag).bind('click', function(event) {
 				scan(block_tag);
 			});
 		});
 	});*/

 	$('.b-tags_filter_js-a .b-k2_item_tag-a').each(function(index_a, el_a) {
	 	$(el_a).bind('click', function(e){
			scan(el_a);
		});
 	});
 });
 