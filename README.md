# Solar CMS table-properties module

Grid Features
========
- Dynamic grid
- Fixed Rom & Column in grid
- Inline edit
- Auto calculation like excel
- Responsive
- Grid permission CRUD
- Grid column types image, link, internal link ...
- Change enum column's value in grid row

Form Features
========
- Dynamic form
- [Show and Hide by other element's value] (https://github.com/solarcms/table-properties#show-and-hide-by-other-elements-value--Өөр-элелентийн-утгаас-хамаарч-харуулах-нуух)
- [Before insert] (https://github.com/solarcms/table-properties#before-insert)


# Grid Features

Change enum column's value in grid row
------------
Grid дээр харуулах мөр доторх баганыг утгаас нь хамаарч өөр текст харуулах бол хэргэлнэ.
Жишээ:

```php
$tp->form_input_control = [
['column'=>'is_buleg', 'title'=>'Бүлэг эсэх', 'type'=>'--text', 'change_value'=>['1'=>'Тийм', '0'=>'Үгүй'], 'fixed'=>false],
];
```



# Form Features

Show and Hide by other element's value == Өөр элелентийн утгаас хамаарч харуулах, нуух
------------
   Энэ боломж нь аль нэг элементийн утгаас хамаарч тухайн элеметийг харуулах, нуух үйлдэл хийнэ.  Form-н column нь дотроо хийж өгөнө 'show'=>[['is_baiguullaga'=>0]]  хийж өгөхдөө ямар элеметийн утга ямар байхад харуулах аа бичиж өгнө.
Жишээ:

```php
$tp->form_input_control = [
 ['column'=>'is_baiguullaga', 'title'=>'Ажил олгогчийн төрөл', 'type'=>'--radio', 'value'=>0, 'choices'=>[
                ['value'=>0, 'text'=>'Аж ахуйн нэгж, байгууллага'],
                ['value'=>1, 'text'=>'Иргэн'],
 ], 'validate'=>'required'],
 ['column'=>'omch_huvi', 'title'=>'Өмчийн хувь', 'type'=>'--number', 'value'=>null, 'validate'=>'required' , 'show'=>[['is_baiguullaga'=>0]]],
];
```


Before insert
------------
Form-н мэдээллийг хадгалахаас өмнө мэдээллийг өөрчлөх эсвэл мэдээлэл нэмэх боломжтой, ямар нэгэн Conroller-н Function зааж өгнө.
Жишээ:

```php

$tp->before_insert = [
            'controller'=>'App\Http\Controllers\AdminController',
            'function'=>'beforeInsertUser',
            'arguments'=>[]
 ];


 //exmample before insert function
    public function beforeInsertUser($data){
         $insert_values = $data['insert_values'];

         $user = [];

         $pass = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 8);

         $toMail = $insert_values['email'];

         Mail::send('mail.register', ['password'=>$pass, 'email'=>$toMail], function($message) use ($toMail) {
             $message->to($toMail);
             $message->subject('Нэвтрэх нууц үг');
         });

         return ['password'=>bcrypt($pass)];
     }
```