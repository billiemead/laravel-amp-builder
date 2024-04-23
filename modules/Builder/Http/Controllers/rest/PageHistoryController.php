<?php

namespace Modules\Builder\Http\Controllers\rest;

use File;
use DB;
use Validator;
use Datatables;
use Illuminate\Support\Facades\Storage;
use Plupload;
use Zipper;
use App\Models\Page;
use App\Models\PageHistory;

class PageHistoryController extends TemplateBuilderController
{
	public function index()
	{
		$page = resolve(Page::class);
		$record = PageHistory::where('page_id', $page->id)->get();
		$record = $record->map(function($item,$key){
			$item->name = $item->created_at->toString();
			return $item;
		});
		return $record;
	}
	
	public function restore()
	{
		$page = resolve(Page::class);
		$history_id = request()->input('id');
		$history = PageHistory::where('page_id', $page->id)->where('id', $history_id)->firstOrFail();
		
		$page->structure = $history->structure;
		if(!empty($history->variant))
			$page->variant = $history->variant;
		$page->save();
		return $page;
	}
	
	public function destroy($id)
	{
		$page = resolve(Page::class);
		$history = PageHistory::where('page_id', $page->id)->where('id', $id)->firstOrFail();
		$history->delete();
		return 1;
	}
}
