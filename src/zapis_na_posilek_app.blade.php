<!doctype html>
<html lang="pl">
<head>
  @include('gtag')
  <meta charset="utf-8">
  <title>Przyrządy MCP</title>
  <base href="{!! config('mcp3.SUBFOLDER', '') !!}/apps/zapis_na_posilek_ie/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="../../favicon.png">

  {!! HTML::script('vendor2018/jquery/dist/jquery.min.js')!!}
  {!! HTML::script('js/vendor/toastr/toastr.min.js') !!}


  <style>

    html {

    }
    html, body {
      min-height: 100%;
      padding: 4px;
      width: 100%;
    }

    body {
      /* https://goo.gl/vEVCQL */
      background: rgb(197, 197, 197);
    }
    .tabelki_mikro table {  border-collapse: collapse;  page-break-inside:auto;  }  .tabelki_mikro td, .tabelki_mikro th {  border: 1px solid black;  padding: 3px;  }  .tabelki_mikro tr {  page-break-inside:avoid;  page-break-after:auto;  }
  </style>

  <script type="text/javascript">
    var BASE = '<?php echo URL::to('/'); ?>'; var MCP = { KLASA: '<?php echo isset(Auth::user()->uprawnienie_systemu) ? Auth::user()->uprawnienie_systemu : "" ?>', LOGIN: '<?php echo isset(Auth::user()->login) ? Auth::user()->login : "" ?>', WYDZIAL: '<?php echo isset(Auth::user()->uprawnienie) ? Auth::user()->uprawnienie : "" ?>'}; var SUBFOLDER = '{!! config('mcp3.SUBFOLDER', '') !!}';
  </script>
</head>
<body>
<app-root>Wczytuję aplikację ...</app-root>
</body>
{!! HTML::style('js/dostawcyglowni/toastr/toastr.css') !!}
</html>
