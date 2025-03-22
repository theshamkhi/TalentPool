<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Updated</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 0 0 15px;
            color: #555555;
        }
        .status {
            font-weight: bold;
            color: #1a73e8;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #777777;
        }
        .footer a {
            color: #1a73e8;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Application Status Updated</h1>
        </div>
        <div class="content">
            <p>Hello {{ $application->candidate->name }},</p>
            <p>The status of your application for the position <strong>{{ $application->offer->title }}</strong> has been updated.</p>
            <p>New Status: <span class="status">{{ ucfirst($application->status) }}</span></p>
            <p>Thank you for your interest in joining our team. We appreciate the time and effort you’ve invested in your application.</p>
            <p>If you have any questions or need further information, feel free to reach out to us.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>{{ config('app.name') }}</p>
            <p><a href="{{ url('/') }}">Visit our website</a> for more opportunities.</p>
        </div>
    </div>
</body>
</html>