Hello, someone subscribed to your form. Here is details:<br/>
@for ($i = 0; $i < sizeof($form_key); $i++)
{{$form_key[$i]}} : {{array_get($form, $i)}}<br/>
@endfor
