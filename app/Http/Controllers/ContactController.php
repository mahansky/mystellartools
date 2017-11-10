<?php

namespace App\Http\Controllers;

use App\Stellar\Constants;

class ContactController extends Controller
{
    public function index()
    {
        return auth()->user()->contacts;
    }

    public function store()
    {
        $data = request()->validate([
            'name' => 'required',
            'public_key' => 'required',
            'memo_type' => 'nullable|in:' . implode(',', Constants::memoTypes()),
            'memo' => 'required_with:memo_type',
        ]);

        auth()->user()->contacts()->create($data);

        return response(['message' => 'Contact added']);
    }

    public function destroy($id)
    {
        $contact = auth()->user()->contacts()->where('id', $id)->firstOrFail();
        $contact->delete();

        return response(['message' => 'Contact deleted']);
    }
}
