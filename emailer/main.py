import re
import fire
import json
from csv_to_json import make_json
from send_email import send_email

def read_json(filename):
    f = open(filename)
    data = json.load(f)
    return data


def write_json(filename, dict_data):
    data = json.dumps(dict_data, indent=4)
    with open(filename, "w") as outfile:
        outfile.write(data)


def read_emailer_message(filename):
    a = open(filename)
    return a.read()
    

def main(csv_file, json_file, sender_email):
    subject = "Inquirying about Job Openings SDE"
    make_json(csvFilePath=csv_file, jsonFilePath=json_file)
    data = read_json(json_file)
    message = read_emailer_message(".emailer_message")

    for i, each in enumerate(data):
        try:
            body = f'''
Dear {each["name"].title()},
{message}
'''
            if "email" not in each or each["email"] == "":
                fname = each["name"].split(" ")[0]
                lname = each["name"].split(" ")[1]
                email_format = each["format"].replace(" ","")
                fformat = re.search(r"\{first(.*?)\}", email_format)
                fformat_split_text = fformat.group(1)
                fformat = fformat.group(0)
                lformat = re.search(r"\{last(.*?)\}", email_format)
                lformat_split_text = lformat.group(1)
                lformat = lformat.group(0)
                first_name = fname[int(fformat_split_text[0]):len(fname) if fformat_split_text[2] == "n" else int(fformat_split_text[2])].lstrip().rstrip()
                last_name = lname[int(lformat_split_text[0]):len(lname) if lformat_split_text[2] == "n" else int(lformat_split_text[2])].lstrip().rstrip()
                each["email"] = email_format
                each["email"] = each["email"].replace(fformat, first_name).replace(lformat, last_name).lower().lstrip().rstrip()

            print("Sending email to: ", each["email"])
            send_email(sender_email=sender_email, subject=subject, body=body, receiver_email=each["email"], filename="assets/pdf/kunj_shah_resume_0506.pdf")
            data[i]["email_sent"] = True
        except Exception as e:
            data[i]["email_sent"] = False
            data[i]["error"] = e
            print(e)
            continue
    
    write_json(json_file, data)
    
if __name__ == '__main__':
    fire.Fire(main)