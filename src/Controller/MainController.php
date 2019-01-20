<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MainController extends Controller
{
    /**
     * @Route("/{username}/", name="main")
     *
     * @param $username
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index($username, Request $request)
    {
        return $this->render('base.html.twig', [
            'apiUrl' => $request->headers->get('x-dh-api-domain'),
            'userName' => $username,
        ]);
    }
}
