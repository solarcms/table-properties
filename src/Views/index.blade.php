@extends('SolarTheme::_layouts.master')

@section('content')



    <div class="box-row">
        <div class="box-cell">
            <div class="box-inner">

                        <div id="root"></div>


            </div>
        </div>
    </div>







    @if(Config::get('app.debug'))
        <link rel="stylesheet" href="http://localhost:3000/css/tp.css" type="text/css"/>
        <script src="http://localhost:3000/js/dependencies.js"></script>
        <script src="http://localhost:3000/js/tp.js"></script>
    @else
        <link rel="stylesheet" href="{{ URL::asset('shared/table-properties/css/tp.css') }}" type="text/css"/>
        <script type="text/javascript" charset="utf-8" src="{{ URL::asset('shared/table-properties/js/dependencies.js')}}"></script>
        <script type="text/javascript" charset="utf-8" src="{{ URL::asset('shared/table-properties/js/tp.js')}}"></script>
    @endif

@endsection