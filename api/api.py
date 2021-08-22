from flask import Flask, request, json
import copy
app = Flask(__name__)
@app.route('/api', methods = ['GET'])
def index():
    return {
        'name': 'Hello World'
    }
@app.route('/api/<int:num>')
def create(num):
    container = []
    helper(num,[],container)
    return {"numStatements": container}
def helper(remain, current, container):
    if (remain == 0):
        container.append(copy.deepcopy(current))
    else:
        current.append("T")
        helper(remain-1,current,container)
        l = len(current)
        current.pop(l-1)
        current.append("F")
        helper(remain-1,current,container)
        current.pop(l-1)
def generate_combo(statements, index, container, current):
    if (index >= len(statements)):
        container.append(copy.deepcopy(current))
    else:
        s = statements[index]
        current[s] = 1
        generate_combo(statements,index+1,container,current)
        current[s] = 0
        generate_combo(statements,index+1,container,current)
@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    request_data = json.loads(request.data)
    statements = count_letter(request_data)
    container = []
    generate_combo(statements,0,container,{})
    l = len(container)
    allResults = []
    error = False
    error_message = []
    for i in range(l):
        to_map = {}
        r = evaluateHelper(request_data,container[i],to_map,error_message)
        if (r == -1):
            error = True
            break
        allResults.append(to_map)
    if (error == True):
        print(error_message)
        return {"error" : error_message[0]}
    return {"result":allResults}
def evaluateHelper(expression,values,to_map,error_message):
    result = evaluating(expression,0,None,values,['|','^','=','>','~'],to_map,error_message)
    print(result)
    return result

def evaluating(expression,index,prevValue,values,operation,to_map,result_response):
    start = index
    if (expression.isalpha()):
        print(expression +" "+ str(values[expression]))
        to_map[expression] = values[expression]
        return values[expression]
    if (index >= len(expression)):
        return prevValue
    else:
        start = expression[index]
        negate = 0
        smaller = ""
        if (prevValue is None) and (start in operation) and (start != '~'):
            result_response.append("Operation " + start +" at index "+ str(index) +" does not have any statement preceding")
            return -1
        if (not prevValue is None) and ((not start in operation) or start=='~'):
            result_response.append("Missing valid operation at index " + str(index))

            return -1
        if start in operation:
            index = index + 1
        if start == '~':
            if (prevValue is None):   
                negate = 1
            elif (not prevValue is None):
                print("Yes1")
                result_response.append("~ at index "+ str(index) +" needs to be at the start of an expression, or followed by an operation")
                return -1
        while (index < len(expression) and expression[index] == '~'):
            negate = 1 - negate
            index = index + 1
        if index == len(expression):
            print("Yes1")
            result_response.append("can not find any expression following ~")
            return -1 
        i = index
        first = 0
        if (i < len(expression) and expression[i] == '('):
            tracker = 1
            index = index + 1
            i = index
            while (tracker > 0 and i < len(expression)) :
                if (expression[i] == '('):
                    tracker = tracker + 1
                elif (expression[i] == ')'):
                    tracker = tracker - 1
                i = i + 1
            if (tracker > 0):
                print("Yes1")
                result_response.append("Missing close parenthesis for statement")
                return -1
            else:
                smaller = expression[index:i-1]
                first = evaluating(smaller,0,None,values,operation,to_map,result_response)
        elif (i < len(expression) and expression[i].isalpha()):
            l = len(expression)
            while (i < l) and (expression[i].isalpha()):
                i = i + 1
            smaller = expression[index:i]
            first = evaluating(smaller,0,None,values,operation,to_map,result_response)
        else:
            print("Yes1")
            result_response.append(expression[index] + " at index " +str(index) + " is not a legal operation" )
            return -1
        result = 0
        if (first == -1):
            return -1
        if (negate == 1):
            first = 1 - first
        if prevValue is None:
            result = first
        else:
            if start == '^':
                if first == 0 or prevValue == 0:
                    result = 0
                else:
                    result = 1
            elif start == '|':
                result = max(prevValue,first)
            elif start == '>':
                if first == 1:
                    result = 1
                else:
                    result = 1 - prevValue   
            elif start == '=':
                result = 1 - (max(first,prevValue) - min(first,prevValue))
            else:
                result_response.append("Operation "+ start + " at index " + index + " is not a valid operation")
                return -1
        subexpression = expression[0:i]
        to_map[subexpression] = result
        second = evaluating(expression,i,result,values,operation,to_map,result_response)
        to_map[expression] = second
        return second

                    
                
                            


                




def count_letter(expression):
    statements = []
    l = len(expression)
    for i in range(l):
        letter = expression[i]
        s = ""
        while (i < l and expression[i].isalpha()):
            s = s + expression[i]
            i = i + 1
        if (s != "" and (not s in statements)):
            statements.append(s)
    return statements




if __name__ == '__main__':
    app.run(debug=True)