<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Mail\AppStatusUpdated;
use Illuminate\Support\Facades\Mail;

class AppController extends Controller
{

    public function apply(Request $request, $offerID)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'letter' => 'required|string',
        ]);

        $candidate = Auth::user();

        $existingApp = App::where('candidate_id', $candidate->id)->where('offer_id', $offerID)->first();

        if ($existingApp) {
            return response()->json(['message' => 'You have already applied to this job.'], 400);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');

        $app = App::create([
            'candidate_id' => $candidate->id,
            'offer_id' => $offerID,
            'cv' => $cvPath,
            'letter' => $request->letter,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'App submitted successfully!', 'data' => $app], 201);
    }

    public function withdraw($appID)
    {
        $candidate = Auth::user();

        $app = App::where('id', $appID)->where('candidate_id', $candidate->id)->first();

        if (!$app) {
            return response()->json(['message' => 'App not found or you do not have permission to delete it.'], 404);
        }

        Storage::disk('public')->delete($app->cv);

        $app->delete();

        return response()->json(['message' => 'App withdrawn successfully!'], 200);
    }

    public function getApps(Request $request)
    {
        $recruiter = Auth::user();

        $offer = Offer::where('recruiter_id', $recruiter->id)->pluck('id');

        $apps = App::whereIn('offer_id', $offer)->with(['candidate', 'offer'])->get();

        if ($request->has('status')) {
            $apps = $apps->where('status', $request->status);
        }

        return response()->json(['data' => $apps], 200);
    }

    public function updateAppStatus(Request $request, $appID)
    {
        $recruiter = Auth::user();

        if ($recruiter->role !== 'recruiter') {
            return response()->json(['message' => 'Only recruiters can update application status.'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,reviewed,accepted,rejected',
        ]);

        $application = App::find($appID);

        if (!$application) {
            return response()->json(['message' => 'Application not found.'], 404);
        }

        $offer = Offer::where('id', $application->offer_id)->where('recruiter_id', $recruiter->id)->first();

        if (!$offer) {
            return response()->json(['message' => 'You are not allowed to edit this application.'], 403);
        }

        $application->status = $request->status;
        $application->save();

        Mail::to($application->candidate->email)->send(new AppStatusUpdated($application));

        return response()->json(['message' => 'Application status successfully updated!', 'data' => $application], 200);
    }
}