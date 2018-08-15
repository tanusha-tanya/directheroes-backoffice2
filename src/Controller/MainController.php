<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MainController extends Controller
{
    /**
     * @Route("/{username}/", name="main")
     */
    public function index($username)
    {
        return $this->render('base.html.twig', [
            'apiUrl' => $this->getParameter('app.api_url'),
            'userName' => $username,
        ]);
    }
}
