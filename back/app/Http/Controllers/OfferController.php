<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offer;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all();
        return response()->json($offers);
    }

    public function show(Offer $offer)
    {
        return response()->json($offer);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'requirements' => 'required|string'
        ]);

        $offer = Offer::create([
            ...$validated,
            'recruiter_id' => Auth::id()
        ]);

        return response()->json($offer, 201);
    }

    public function update(Request $request, Offer $offer)
    {
        if ($offer->recruiter_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'requirements' => 'sometimes|required|string'
        ]);

        $offer->update($validated);
        return response()->json($offer);
    }

    public function destroy(Offer $offer)
    {
        if ($offer->recruiter_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $offer->delete();
        return response()->json(['message' => 'Offer removed']);
    }
}