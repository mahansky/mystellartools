@extends('recovery.layout')

@section('content')
    <form action="{{ url('recovery') }}" method="post">
        {{ csrf_field() }}
        <div>
            <label>Email (used in registration)</label>
            <input type="email" name="email">
        </div>
        <div>
            <label>Password (used to encrypt your secret key)</label>
            <input type="password" name="password">
        </div>
        <button>Recover secret key</button> * Your account will be permanently deleted after this operation.
    </form>
@endsection