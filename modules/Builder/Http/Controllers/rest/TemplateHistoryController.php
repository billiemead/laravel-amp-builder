<?php

namespace Modules\Builder\Http\Controllers\rest;

use File;
use DB;
use Validator;
use Datatables;
use Illuminate\Support\Facades\Storage;
use Plupload;
use Zipper;
use App\Models\Template;
use App\Models\TemplateHistory;

class TemplateHistoryController extends TemplateBuilderController
{
	public function index()
	{
		$page = resolve(Template::class);
		$record = TemplateHistory::where('template_id', $page->id)->get();
		$record = $record->map(function($item,$key){
			$item->name = $item->created_at->toString();
			return $item;
		});
		return $record;
	}
	
	public function restore()
	{
		$page = resolve(Template::class);
		$history_id = request()->input('id');
		$history = TemplateHistory::where('template_id', $page->id)->where('id', $history_id)->firstOrFail();
		
		$page->structure = $history->structure;
		//if(!empty($history->variant))
			//$page->variant = $history->variant;
		$page->save();
		return $page;
	}
	
	public function destroy($id)
	{
		$page = resolve(Template::class);
		$history = TemplateHistory::where('template_id', $page->id)->where('id', $id)->firstOrFail();
		$history->delete();
		return 1;
	}
}
