<!DOCTYPE html>
<html>
    <head>      
        <link rel="stylesheet" href="assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous"></head>
        <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
        <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script> -->


        <link href="assets/css/video-js.min.css" rel="stylesheet">
        <link href="assets/css/videojs.record.css" rel="stylesheet">
        <link href="assets/css/upload.css" rel="stylesheet">

        <script src="assets/js/jquery.min.js"></script>
        <script src="assets/js/bootstrap.min.js"></script>
        
        <script src="assets/js/video.min.js"></script>
        <script src="assets/js/RecordRTC.js"></script>
        <script src="assets/js/adapter.js"></script>

        <script src="assets/js/videojs.record.js"></script>

    </head>
    <body>
        <button onClick="document.getElementById('files').click()"><span>Select For Upload...</span></button>
            <input type="file" name="files[]" multiple="" id="files" style='display: none'/>
            <input type="button" value="Upload File" name="submit" id="output"/>
        
        <div id="newvideo"></div>
        <script src="assets/js/upload.js"></script>
    </body>
</html>