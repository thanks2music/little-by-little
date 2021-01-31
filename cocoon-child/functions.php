<?php //子テーマ用関数
if ( !defined( 'ABSPATH' ) ) exit;

//子テーマ用のビジュアルエディタースタイルを適用
add_editor_style();

// 除外するカテゴリーIDを配列で指定する
// add_filter( 'get_related_wp_query_args', function ($args){
//   $args['category__not_in'] = array(19);
//   return $args;
// } ); 
