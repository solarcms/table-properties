Solar CMS table-properties module


-- Формын элементийг өөр элелентийн утгаас хамаарч харуулах, нуух ---
   Энэ боломж нь аль нэг элементийн утгаас хамаарч тухайн элеметийг харуулах, нуух үйлдэл хийнэ.  Form-н column нь дотроо хийж өгөнө 'show'=>[['is_baiguullaga'=>0]]  хийж өгөхдөө ямар элеметийн утга ямар байхад харуулах аа бичиж өгнө.
Жишээ:

 ['column'=>'is_baiguullaga', 'title'=>'Ажил олгогчийн төрөл', 'type'=>'--radio', 'value'=>0, 'choices'=>[
                ['value'=>0, 'text'=>'Аж ахуйн нэгж, байгууллага'],
                ['value'=>1, 'text'=>'Иргэн'],
 ], 'validate'=>'required'],
 ['column'=>'omch_huvi', 'title'=>'Өмчийн хувь', 'type'=>'--number', 'value'=>null, 'validate'=>'required' , 'show'=>[['is_baiguullaga'=>0]]],
