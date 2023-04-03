<?php

namespace App\Http\Controllers;

use App\Models\Errors;
use App\Models\Generation;
use Error;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

class GPTController extends Controller
{
    public static function textGen(
        string $prompt,
        int $max_tokens = 512,
        float $temperature = 0.7,
        string $type="não-definido"
        ):string{
            $client = new Client();
            $model = env("OPENAI_TEXT_MODEL");
            try{
                $response = $client->request('POST', 'https://api.openai.com/v1/completions', [
                    'headers' => [
                        'Authorization' => 'Bearer '.env("OPENAI_KEY"),
                    ],
                    'json' => compact('model', 'prompt', 'max_tokens', 'temperature'),
                ]);
                $json = json_decode($response->getBody()->getContents());
                Generation::create([
                    "model" => $model,
                    "type" => $type,
                    "prompt" => $prompt,
                    "response" => $json,
                    "gen_type" => "text"
                ]);
            } catch(RequestException $e){
                error_log("erro na geração de texto: HTTP ".$e->getCode());
                Errors::create([
                    "message" => $e->getResponse()->getBody(),
                    "type" => "requisição a openAI",
                    
                ]);
            }
            return $json->choices[0]->text ?? "erro na geração";
    }
    public static function imageGen(
        $prompt,
        $type = "não-definido"
    ){
        $client = new Client();
        try{
            $response = $client->request('POST', 'https://api.openai.com/v1/images/generations', [
                'headers' => [
                    'Authorization' => 'Bearer '.env("OPENAI_KEY"),
                ],
                'json' => [
                    'prompt' => $prompt,
                    'n' => 1,
                    'size' => '1024x1024'
                ]
            ]);
            $json = json_decode($response->getBody()->getContents());
            Generation::create([
                "model" => "dalle2",
                "gen_type" => "image",
                "prompt" => $prompt,
                "response" => $json,
                'type' => $type,
            ]);

        }catch(RequestException $e){
            Errors::create([
                "message" => $e->getResponse()->getBody(),
                "type" => "requisição a openAI",
            ]);
        }
    }
}
