<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {
        $data = file_get_contents('php://input'); 
        $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';

        $exp = explode(',', $data);
        
        $decoded = base64_decode($exp[2]);

        $path = './uploads/';
        if (!is_dir($path)) {
            mkdir($path);
        }

        $file = 'uploads/' . substr(str_shuffle($permitted_chars), 0, 10) . '.mp4';
        file_put_contents($file, $decoded);
        $res = array('video' => $file);
        print json_encode($res);
    }
    else if (isset($_FILES['files'])) {
        $errors = [];

        $path = './uploads/';
        if (!is_dir($path)) {
            mkdir($path);
        }
        
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4',];

        $all_files = count($_FILES['files']['tmp_name']);

        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $tmp = explode('.', $_FILES['files']['name'][$i]);
            $file_ext = strtolower(end($tmp));
            $file = $path . $file_name;

            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }

            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }

            if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);

                $res = array('video' => $file);
                print json_encode($res);
            }
        }

    if ($errors) print_r($errors);
    }
 }