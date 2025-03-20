<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offer;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all();
        return response()->json($offers);
    }

    public function show($id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }
        return response()->json($offer);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'location' => 'required|string',
            'requirements' => 'required|string',
            'recruiter_id' => 'integer|exists:users,id',
        ]);

        $offer = Offer::create($request->all());
        return response()->json($offer, 201);
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string',
            'requirements' => 'sometimes|required|string',
            'recruiter_id' => 'integer|exists:users,id',
        ]);

        $offer->update($request->all());
        return response()->json($offer);
    }

    public function destroy($id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $offer->delete();
        return response()->json(['message' => 'Offer removed']);
    }
}
