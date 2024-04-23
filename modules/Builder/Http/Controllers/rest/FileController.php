<?php

namespace Modules\Builder\Http\Controllers\rest;

use App\Http\Controllers\rest\FileController as ParentController;
use File;
use DB;
use Validator;
use Zipper;
use Plupload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Cache;

class FileController extends ParentController
{
}
