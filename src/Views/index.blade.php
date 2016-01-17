@extends('XTheme::_layouts.master')

@section('style')
    @if(Config::get('tm_config.tm_debug'))
        <link rel="stylesheet" href="http://localhost:3000/css/tp.css" type="text/css"/>
    @else
        <link rel="stylesheet" href="{{ URL::asset('shared/table-properties/css/tp.css') }}" type="text/css"/>
    @endif
@endsection

@section('content')


    <div class="app-body" id="view">
        <div class="app-body-inner" >

            <div class="row-col row-col-xs b-b">
                <div class="col-sm-3 col-md-2 white b-r">
                    @include('XTheme::_partials.setting_panel')
                </div>

                <div class="col-sm-9 col-md-10 map-outer-wrapper">
                    <div id="solar-tp"></div>
                </div>
            </div>
        </div>
    </div>



@endsection


@section('script')
    @if(Config::get('tm_config.tm_debug'))
        <script src="http://localhost:3000/js/dependencies.js"></script>
        <script src="http://localhost:3000/js/tp.js"></script>
    @else
        <script type="text/javascript" charset="utf-8" src="{{ URL::asset('shared/table-properties/js/dependencies.js')}}"></script>
        <script type="text/javascript" charset="utf-8" src="{{ URL::asset('shared/table-properties/js/tp.js')}}"></script>
    @endif
@endsection