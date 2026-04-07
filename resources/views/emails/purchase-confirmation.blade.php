<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Confirmed</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.7;
            color: #3a3a3a;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 30px auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        }

        .email-body {
            background-color: white;
            padding: 35px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 500;
            color: #333;
            margin-bottom: 20px;
        }

        .message {
            color: #555;
            font-size: 16px;
        }

        .message p {
            margin-bottom: 20px;
        }

        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .order-table td {
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            font-size: 15px;
            color: #555;
        }

        .order-table td:last-child {
            text-align: right;
            font-weight: 600;
            color: #333;
        }

        .download-btn {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            padding: 14px 32px;
            margin: 24px 0 8px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
        }

        .expiry-note {
            color: #888;
            font-size: 13px;
            margin-top: 0;
            margin-bottom: 20px;
        }

        .signature {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 1px solid #eee;
            font-size: 15px;
        }

        .name {
            font-weight: 600;
            color: #333;
            font-size: 16px;
        }

        .email-footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="email-body">
            <div class="greeting">Hello {{ $customerName }},</div>

            <div class="message">
                <p>Your payment has been confirmed. Here are your order details:</p>

                <table class="order-table">
                    <tr>
                        <td>Order Reference</td>
                        <td>{{ $reference }}</td>
                    </tr>
                    <tr>
                        <td>Project</td>
                        <td>{{ $capstoneTitle }}</td>
                    </tr>
                    <tr>
                        <td>Amount Paid</td>
                        <td>&#8369;{{ number_format((float) $amount, 2) }}</td>
                    </tr>
                </table>

                <p>Click the button below to download your source code:</p>

                <a href="{{ $appUrl }}/download/{{ $downloadToken }}" class="download-btn">
                    &#11015; Download Source Code
                </a>

                <p class="expiry-note">This link expires 72 hours after your payment.</p>

                <p>
                    If you have any questions, contact us at
                    <a href="mailto:{{ $supportEmail }}">{{ $supportEmail }}</a>.
                </p>
            </div>

            <div class="signature">
                <div class="name">Student Web Solutions</div>
            </div>
        </div>

        <div class="email-footer">
            <p>This email was sent to {{ $customerEmail }}</p>
            <p>&copy; {{ date('Y') }} Student Web Solutions</p>
        </div>
    </div>
</body>

</html>
