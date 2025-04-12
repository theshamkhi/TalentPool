<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Mail\AppStatusUpdated;
use Illuminate\Support\Facades\Mail;

class AppController extends Controller
{
    public function apply(Request $request, Offer $offer)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'letter' => 'required|string|max:1000'
        ]);

        $candidate = Auth::user();

        if (App::where('candidate_id', $candidate->id)->where('offer_id', $offer->id)->exists()) {
            return response()->json(['message' => 'You already applied to this offer'], 409);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');

        try {
            $app = App::create([
                'candidate_id' => $candidate->id,
                'offer_id' => $offer->id,
                'cv' => $cvPath,
                'letter' => $request->letter,
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Application submitted successfully',
                'data' => $app->load('offer')
            ], 201);
        } catch (\Exception $e) {
            Storage::delete($cvPath);
            return response()->json(['message' => 'Application failed: ' . $e->getMessage()], 500);
        }
    }

    public function withdraw(App $app)
    {
        $user = Auth::user();
        
        if ($app->candidate_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        if (!in_array($app->status, ['pending', 'reviewed'])) {
            return response()->json(['message' => 'Cannot withdraw application in current state'], 409);
        }

        try {
            Storage::disk('public')->delete($app->cv);
            $app->delete();

            return response()->json(['message' => 'Application withdrawn successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Withdrawal failed: ' . $e->getMessage()], 500);
        }
    }

    public function getRecruiterApps(Request $request)
    {
        $recruiter = Auth::user();
        
        $query = App::whereHas('offer', fn($q) => $q->where('recruiter_id', $recruiter->id))
            ->with(['candidate', 'offer']);
            
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $apps = $query->paginate(10);

        return response()->json($apps);
    }

    public function getCandidateApps()
    {
        $candidate = Auth::user();
        
        $apps = App::where('candidate_id', $candidate->id)
            ->with(['offer'])
            ->get();

        return response()->json($apps);
    }

    public function updateAppStatus(Request $request, App $app)
    {
        $recruiter = Auth::user();
        
        if ($app->offer->recruiter_id !== $recruiter->id) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,reviewed,accepted,rejected'
        ]);

        try {
            $app->update(['status' => $request->status]);
            
            Mail::to($app->candidate->email)->send(new AppStatusUpdated($app));
                
            return response()->json([
                'message' => 'Status updated successfully',
                'data' => $app->load('candidate')
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    public function getRecruiterStats()
    {
        $recruiter = Auth::user();
        
        $offers = Offer::where('recruiter_id', $recruiter->id)->get();

        return response()->json([
            'total_offers' => $offers->count(),
            'total_applications' => App::whereIn('offer_id', $offers->pluck('id'))->count(),
            'applications_by_status' => App::whereIn('offer_id', $offers->pluck('id'))
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray(),
            'applications_by_offer' => $offers->map(function($offer) {
                return [
                    'offer_title' => $offer->title,
                    'total_applications' => $offer->applications()->count(),
                    'applications_by_status' => $offer->applications()
                        ->selectRaw('status, count(*) as count')
                        ->groupBy('status')
                        ->get()
                        ->pluck('count', 'status')
                        ->toArray()
                ];
            })->toArray()
        ]);
    }
}