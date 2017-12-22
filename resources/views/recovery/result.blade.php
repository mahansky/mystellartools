@extends('recovery.layout')

@section('content')
    @forelse($keys as $key)
        <div>Secret key: <b>{{ $key }}</b></div>
    @empty
        <span>Invalid password or nothing to recover (no secret key stored on our servers).</span>
        <a href="{{ url('recovery') }}">Retry</a>
    @endforelse
@endsection