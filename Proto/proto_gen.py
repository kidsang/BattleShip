defPath = './proto_define.js'
outPath = './Proto.js'

out = 'Proto = {\n'

defFile = open(defPath, 'r')
i = 1
for line in defFile:
	line = line.strip()
	if len(line) == 0 or line[:2] == '//':
		continue
	out += '\t' + line + ':"' + str(i) + '",\n'
	i += 1

out = out[:-2] + '\n'
out += '};\n'
out += 'if (module) module.exports = Proto;'
defFile.close()

outFile = open(outPath, 'w')
outFile.write(out)
outFile.close()
print 'done.'

