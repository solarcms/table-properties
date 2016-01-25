<?php

namespace Solarcms\Core\TableProperties\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;

use Solarcms\TableProperties\TableProperties;
use Request;
use Solarcms\Core\TableProperties\Tp\Tp;
class TablePropertiesController extends Controller {

    public function __construct(){

    }
    public function singleUploader(){
        $file = Input::file('file');
        $item_name = Input::input('item_name');

        $rules = array(
            'file' => 'required|mimes:png,gif,jpeg|max:50000'
        );

        $validator = Validator::make(Input::all(), $rules);

        if ($validator->passes()) {

            $newFilename = \Carbon\Carbon::now()->format('Y_m_d__h_i_s') . '.' . $file->getClientOriginalExtension();



            $destinationPath = public_path() . '/uploads/';
            $destinationPathThumb = public_path() . '/uploads/thumbs/';



            while (File::exists($destinationPath . $newFilename)) {

                $newFilename = uniqid() . "_" . $newFilename;
            }

            $uploadSuccess = Image::make($file->getRealPath());
            $bigImage = $uploadSuccess->resize(1600, null, function ($constraint) {
                $constraint->aspectRatio();
            });
            $bigImage->save($destinationPath . $newFilename, 100);

            $thum_iamge = $uploadSuccess->resize(364, null, function ($constraint) {
                $constraint->aspectRatio();
            });
            $thum_iamge->save($destinationPathThumb . $newFilename);


            if($uploadSuccess) {




                return Response::json($newFilename, 200); // or do a redirect with some message that file was uploaded
            } else {
                return Response::json('error', 400);
            }
        } else {
            return Response::json('error. Invalid file format or size >5Mb', 400);
        }
    }



    public function TableProperties($slug, $action = 'index') {

        switch($slug){
            case "acticle_category":          return $this->acticle_category($action);        break;
            case "article":          return $this->article($action);        break;
            case "locales":          return $this->locales($action);        break;
            case "category":          return $this->category($action);        break;
            case "product_detail":          return $this->product_detail($action);        break;
            default:              return $this->acticle_category($action);
        }



    }




}